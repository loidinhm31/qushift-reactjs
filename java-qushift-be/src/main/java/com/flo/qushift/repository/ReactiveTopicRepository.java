package com.flo.qushift.repository;

import com.flo.qushift.document.Topic;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ReactiveTopicRepository extends ReactiveMongoRepository<Topic, String> {
    @Query(value = "{'members': {$elemMatch: {'userId': ?0}}}")
    Flux<Topic> findByMemberMatchUser(String userId, Pageable pageable);

    Mono<Topic> findById(String topicId);

    @Query(value = "{'members': {$elemMatch: {'userId': ?0}}}")
    Flux<Topic> findByMemberMatchUser(String userId);

    @Query(value = "{$and: [" +
            "{'_id': ?0}, " +
            "{'members': {$elemMatch: {'userId': ?1}}}" +
            "]}")
    Mono<Topic> findByIdAndMemberMatchUser(ObjectId topicId, String userId);
}
