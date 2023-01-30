package com.flo.qushift.service;

import com.flo.qushift.document.BaseDocument;
import com.flo.qushift.document.Message;
import com.flo.qushift.document.StreamMessage;
import com.flo.qushift.document.Topic;
import com.flo.qushift.dto.MessageDto;
import com.flo.qushift.model.Member;
import com.flo.qushift.repository.MessageStreamRepository;
import com.flo.qushift.repository.ReactiveMessageRepository;
import com.flo.qushift.repository.ReactiveTopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import reactor.core.Disposable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.Comparator;

@RequiredArgsConstructor
@Service
public class MessageService {

    private final ReactiveMessageRepository reactiveMessageRepository;

    private final MessageStreamRepository messageStreamRepository;

    private final ReactiveTopicRepository reactiveTopicRepository;
    public Mono<Void> saveMessage(MessageDto messageDto) {
        // Update information for topic
        Mono<Topic> topicMono = reactiveTopicRepository.findById(messageDto.getTopicId());
        subscribeAndSaveAndDisposeTopic(topicMono, messageDto);

        return Mono.empty();
    }

    public Mono<Void> deleteMessage(Message message) {
        return reactiveMessageRepository.delete(message);
    }

    public Flux<StreamMessage> getTailMessages(String topicId) {
        return messageStreamRepository.findByTopicId(topicId);
    }

    public Flux<Message> getPaginatedMessages(String topicId, int start, int pageSize) {
        return reactiveMessageRepository.findAllByTopicId(
                topicId,
                PageRequest.of(start, pageSize, Sort.by("createdAt").descending())
        ).sort(Comparator.comparing(BaseDocument::getCreatedAt));
    }

    private Disposable subscribeAndSaveAndDisposeTopic(Mono<Topic> topicMono, MessageDto messageDto) {
        Disposable disposableTopic = topicMono
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(topic -> {

                    // Currently only check with user from DTO, TODO(#1) check from authentication
                    Optional<Member> resultMember =
                            topic.getMembers().stream().filter(user -> user.getUser().equals(messageDto.getSender())).findAny();

                    if (resultMember.isPresent()) {
                        // Update topic props
                        topic.getMembers().forEach(member -> {
                            if (member.getUser().equals(messageDto.getSender())) {
                                if (!member.getCheckSeen()) {
                                    member.setCheckSeen(Boolean.TRUE);
                                    member.setNotSeenCount(0);
                                }
                            } else {
                                member.setCheckSeen(Boolean.FALSE);
                                member.setNotSeenCount(member.getNotSeenCount() + 1);
                            }
                        });
                        reactiveTopicRepository.save(topic).subscribe();

                        // Save main message
                        Message message = Message.builder()
                                .topicId(messageDto.getTopicId())
                                .sender(messageDto.getSender())
                                .receiver(messageDto.getReceiver())
                                .content(messageDto.getContent())
                                .createdAt(LocalDateTime.now())
                                .build();
                        Mono<Message> messageMono = reactiveMessageRepository.save(message);

                        // Save stream message flow
                        saveAndDisposeMessage(messageMono);
                    }
                })
                .subscribe();
        return disposableTopic;
    }

    private Disposable saveAndDisposeMessage(Mono<Message> messageMono) {
        return messageMono
                .publishOn(Schedulers.boundedElastic())
                .subscribe(message -> {
                    StreamMessage streamMessage = StreamMessage.builder()
                            .id(message.getId())    // Save with the same message id
                            .topicId(message.getTopicId())
                            .sender(message.getSender())
                            .receiver(message.getReceiver())
                            .content(message.getContent())
                            .createdAt(message.getCreatedAt())
                            .build();
                    messageStreamRepository.save(streamMessage).subscribe();
                });
    }
}
