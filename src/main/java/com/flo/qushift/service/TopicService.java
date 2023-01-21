package com.flo.qushift.service;

import com.flo.qushift.document.Message;
import com.flo.qushift.document.Topic;
import com.flo.qushift.dto.TopicDto;
import com.flo.qushift.repository.MessageStreamRepository;
import com.flo.qushift.repository.ReactiveTopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

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
                reactiveTopicRepository.findAllByMemberMatchUser(userId,
                        PageRequest.of(start, pageSize)
                );

        return channelFlux;
    }

    public Flux<Topic> getTailMessagesByReceiver(String receiverId) {
        Flux<Message> messageFlux = messageStreamRepository.findByReceiverOrSender(receiverId, receiverId);

        Flux<Topic> topicFlux = messageFlux
                .flatMap(message ->
                        reactiveTopicRepository.findTopicByMemberMatchUser(receiverId));

        return topicFlux;
    }

    public Mono<Void> changeCheckSeenTopicForMember(String topicId) {
        Mono<Topic> messageMono = reactiveTopicRepository.findTopicById(topicId);

        return messageMono
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(topic -> {
                    topic.getMembers().forEach(member -> {
                        member.setCheckSeen(Boolean.TRUE);
                        member.setNotSeenCount(0);
                    });

                    reactiveTopicRepository.save(topic).subscribe();
                })
                .then();
    }
}
