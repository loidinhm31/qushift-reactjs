package com.flo.qushift.repository;

import com.flo.qushift.document.Topic;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ReactiveTopicRepository extends ReactiveMongoRepository<Topic, String> {
    @Query(value = "{'members': {$elemMatch: {'user': ?0}}}")
    Flux<Topic> findAllByMemberMatchUser(String userId, Pageable pageable);

    Mono<Topic> findTopicById(String topicId);

    @Query(value = "{'members': {$elemMatch: {'user': ?0}}}")
    Flux<Topic> findTopicByMemberMatchUser(String userId);
}
