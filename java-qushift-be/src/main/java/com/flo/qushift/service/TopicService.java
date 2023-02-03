package com.flo.qushift.service;

import com.flo.qushift.document.StreamMessage;
import com.flo.qushift.document.Topic;
import com.flo.qushift.dto.TopicDto;
import com.flo.qushift.model.Member;
import com.flo.qushift.repository.MessageStreamRepository;
import com.flo.qushift.repository.ReactiveTopicRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class TopicService {

    private final ReactiveTopicRepository reactiveTopicRepository;

    private final MessageStreamRepository messageStreamRepository;

    public Mono<Topic> saveChannel(TopicDto topicDto) {
        Topic topic = Topic.builder()
                .name(topicDto.getName())
                .members(topicDto.getMembers())
                .createdAt(LocalDateTime.now())
                .build();

        return reactiveTopicRepository.save(topic);
    }

    public Flux<Topic> getPaginatedTopics(String userId, int start, int pageSize) {
        Flux<Topic> channelFlux =
                reactiveTopicRepository.findByMemberMatchUser(userId,
                        PageRequest.of(start, pageSize)
                );

        return channelFlux;
    }

    public Mono<Topic> getTopicByUser(String topicId, String userId) {
        // TODO(#1)
        Mono<Topic> topicMono =
                reactiveTopicRepository.findByIdAndMemberMatchUser(new ObjectId(topicId), userId);

        return topicMono;
    }

    public Flux<Topic> getStreamMessagesByReceiver(String receiverId) {
        Flux<StreamMessage> messageFlux = messageStreamRepository.findByReceiverOrSender(receiverId, receiverId)
                .subscribeOn(Schedulers.boundedElastic());

        Flux<Topic> topicFlux = messageFlux
                .flatMap(message ->
                        reactiveTopicRepository.findByMemberMatchUser(receiverId))
                .filter(topic -> topic.getMembers().stream()
                        .anyMatch(member -> !member.getCheckSeen()));

        return topicFlux;
    }

    public Mono<Void> changeCheckSeenTopicForMember(String topicId, String userId) {
        Mono<Topic> messageMono = reactiveTopicRepository.findByIdAndMemberMatchUser(new ObjectId(topicId), userId);

        return messageMono
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(topic -> {
                    topic.getMembers().forEach(member -> {
                        if (member.getUserId().equals(userId)) {
                            member.setCheckSeen(Boolean.TRUE);
                            member.setNotSeenCount(0);
                        }
                    });

                    reactiveTopicRepository.save(topic).subscribe();
                })
                .then();
    }
}
