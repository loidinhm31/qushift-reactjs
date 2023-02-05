package com.flo.qushift.service;

import com.flo.qushift.document.*;
import com.flo.qushift.dto.MessageDto;
import com.flo.qushift.model.Member;
import com.flo.qushift.repository.MessageStreamRepository;
import com.flo.qushift.repository.ReactiveMessageRepository;
import com.flo.qushift.repository.ReactiveTopicRepository;
import com.flo.qushift.repository.TopicStreamRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MessageService {

    private final ReactiveMessageRepository reactiveMessageRepository;

    private final MessageStreamRepository messageStreamRepository;

    private final ReactiveTopicRepository reactiveTopicRepository;

    private final TopicStreamRepository topicStreamRepository;

    public Mono<StreamMessage> saveMessage(MessageDto messageDto) {
        // Update information for topic
        Mono<Topic> topicMono = reactiveTopicRepository.findById(messageDto.getTopicId());
        return topicMono
                .publishOn(Schedulers.boundedElastic())
                .flatMap(topic -> {

                    // Currently only check with user from DTO, TODO(#1) check from authentication
                    Optional<Member> resultMember =
                            topic.getMembers().stream().filter(user -> user.getUserId().equals(messageDto.getSender())).findAny();

                    if (resultMember.isPresent()) {
                        // Update topic props
                        topic.getMembers().forEach(member -> {
                            if (member.getUserId().equals(messageDto.getSender())) {
                                if (!member.getCheckSeen()) {
                                    member.setCheckSeen(Boolean.TRUE);
                                    member.setNotSeenCount(0);
                                }
                            } else {
                                member.setCheckSeen(Boolean.FALSE);
                                member.setNotSeenCount(member.getNotSeenCount() + 1);
                            }
                        });
                        reactiveTopicRepository.save(topic).subscribeOn(Schedulers.boundedElastic())
                                .subscribe(t -> {
                                    // Also save in topics stream
                                    StreamTopic streamTopic = StreamTopic.builder()
                                            .originId(t.getId())
                                            .name(t.getName())
                                            .members(t.getMembers())
                                            .createdAt(t.getCreatedAt())
                                            .build();
                                    topicStreamRepository.save(streamTopic).subscribe();
                                });

                        // Save main message
                        Message message = Message.builder()
                                .topicId(messageDto.getTopicId())
                                .sender(messageDto.getSender())
                                .receiver(messageDto.getReceiver())
                                .content(messageDto.getContent())
                                .createdAt(LocalDateTime.now())
                                .build();
                        return reactiveMessageRepository.save(message)
                                .flatMap(mm -> {
                                    // Save stream message
                                    StreamMessage streamMessage = StreamMessage.builder()
                                            .id(mm.getId())    // Save with the same message id
                                            .topicId(mm.getTopicId())
                                            .sender(mm.getSender())
                                            .receiver(mm.getReceiver())
                                            .content(mm.getContent())
                                            .createdAt(mm.getCreatedAt())
                                            .build();
                                    return messageStreamRepository.save(streamMessage);
                                });
                    }
                    return Mono.just(StreamMessage.builder().build());
                });
    }

    public Mono<Void> deleteMessage(Message message) {
        return reactiveMessageRepository.delete(message);
    }

    public Flux<StreamMessage> getStreamMessagesByTopic(String topicId) {
        return messageStreamRepository.findAllByTopicIdNotNull()
                .filter(streamMessage -> streamMessage.getTopicId().equals(topicId));
    }

    public Flux<Message> getPaginatedMessages(String topicId, int start, int pageSize, String userId) {
        // TODO(#1) Check user from authentication, currently only check from param
        Mono<Topic> topicMono = reactiveTopicRepository.findByIdAndMemberMatchUser(new ObjectId(topicId), userId)
                .subscribeOn(Schedulers.boundedElastic());

        return topicMono
                .flatMapMany(topic -> {
                    if (Objects.nonNull(topic)) {
                        return reactiveMessageRepository.findAllByTopicId(
                                topicId,
                                userId,
                                PageRequest.of(start, pageSize, Sort.by("createdAt").descending())
                        ).sort(Comparator.comparing(BaseDocument::getCreatedAt));
                    }
                    return Flux.empty();
                });
    }
}
