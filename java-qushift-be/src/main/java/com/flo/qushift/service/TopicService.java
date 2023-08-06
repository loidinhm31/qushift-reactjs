package com.flo.qushift.service;

import com.flo.qushift.document.StreamTopic;
import com.flo.qushift.document.Topic;
import com.flo.qushift.dto.TopicDto;
import com.flo.qushift.model.Member;
import com.flo.qushift.repository.ReactiveTopicRepository;
import com.flo.qushift.repository.TopicStreamRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

@RequiredArgsConstructor
@Service
public class TopicService {

    private final ReactiveTopicRepository reactiveTopicRepository;

    private final TopicStreamRepository topicStreamRepository;

    public Mono<StreamTopic> saveTopic(TopicDto topicDto) {
        if (StringUtils.isBlank(topicDto.getName()) || CollectionUtils.isEmpty(topicDto.getMembers())) {
            throw new IllegalArgumentException();
        }

        Topic topic = Topic.builder()
                .name(topicDto.getName())
                .members(new HashSet<>(topicDto.getMembers()))
                .createdAt(LocalDateTime.now())
                .build();

        return reactiveTopicRepository.save(topic)
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(t -> {
                    StreamTopic streamTopic = StreamTopic.builder()
                            .id(t.getId())
                            .originId(t.getId())
                            .isNew(Boolean.TRUE)
                            .name(t.getName())
                            .members(t.getMembers())
                            .build();
                    return topicStreamRepository.save(streamTopic);
                });
    }

    public Flux<Topic> getPaginatedTopics(int start, int pageSize, String userId) {
        // TODO(#1) Check user from authentication, currently only check from param

        return reactiveTopicRepository.findByMemberMatchUser(
                userId,
                PageRequest.of(start, pageSize, Sort.by("createdAt").descending())
        );
    }

    public Mono<Topic> getTopicByUser(String topicId, String userId) {
        // TODO(#1)
        Mono<Topic> topicMono =
                reactiveTopicRepository.findByIdAndMemberMatchUser(new ObjectId(topicId), userId);

        return topicMono;
    }

    public Flux<StreamTopic> getStreamMessagesByReceiver(String receiverId) {
        return topicStreamRepository.findByMemberMatchUser(receiverId);
    }

    public Mono<Void> changeCheckSeenTopicForMember(String topicId, String userId) {
        Mono<Topic> topicMono = reactiveTopicRepository.findByIdAndMemberMatchUser(new ObjectId(topicId), userId);

        return topicMono
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

    public Mono<Void> addMembers(String topicId, List<Member> members) {
        Mono<Topic> topicMono = reactiveTopicRepository.findById(topicId);
        return topicMono
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(topic -> {
                    topic.getMembers().addAll(members);

                    reactiveTopicRepository.save(topic).subscribe();
                })
                .then();
    }
}
