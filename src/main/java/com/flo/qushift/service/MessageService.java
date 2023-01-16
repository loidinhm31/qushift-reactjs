package com.flo.qushift.service;

import com.flo.qushift.document.BaseDocument;
import com.flo.qushift.document.Message;
import com.flo.qushift.document.StreamMessage;
import com.flo.qushift.document.Topic;
import com.flo.qushift.dto.MessageDto;
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

    public Mono<StreamMessage> saveMessage(MessageDto messageDto) {
        Message message = Message.builder()
                .topicId(messageDto.getTopicId())
                .sender(messageDto.getSender())
                .receiver(messageDto.getReceiver())
                .content(messageDto.getContent())
                .createdAt(LocalDateTime.now())
                .build();

        // Save main message
        saveAndDisposeMessage(message);

        // Update information for topic
        Mono<Topic> topicMono = reactiveTopicRepository.findTopicById(message.getTopicId());
        subscribeAndSaveAnDisposeTopic(topicMono, message.getSender());

        StreamMessage streamMessage = StreamMessage.builder()
                .id(message.getId())
                .topicId(messageDto.getTopicId())
                .sender(messageDto.getSender())
                .receiver(messageDto.getReceiver())
                .content(messageDto.getContent())
                .createdAt(message.getCreatedAt())
                .build();
        return messageStreamRepository.save(streamMessage);
    }

    public Mono<Void> deleteMessage(Message message) {
        return reactiveMessageRepository.delete(message);
    }

    public Flux<StreamMessage> getTailMessages(String topicId) {
        return messageStreamRepository.findByTopicId(topicId);
    }

    public Flux<Message> getPaginatedMessages(String topicId, int start, int pageSize) {
        return reactiveMessageRepository.findAllByTopicId(topicId, PageRequest.of(start, pageSize, Sort.by("createdAt").descending())).sort(Comparator.comparing(BaseDocument::getCreatedAt));
    }

    private Disposable saveAndDisposeMessage(Message message) {
        return reactiveMessageRepository.save(message).subscribe();
    }

    private Disposable subscribeAndSaveAnDisposeTopic(Mono<Topic> topicMono, String sender) {
        return topicMono
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(topic -> {
                    topic.getMembers().forEach(member -> {
                        if (member.getUser().equals(sender)) {
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
                })
                .subscribe();
    }
}
