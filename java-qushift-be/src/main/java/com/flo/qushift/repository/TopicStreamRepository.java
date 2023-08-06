package com.flo.qushift.repository;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;

import com.flo.qushift.document.StreamTopic;

import reactor.core.publisher.Flux;

public interface TopicStreamRepository extends ReactiveMongoRepository<StreamTopic, String> {
    @Tailable
    @Query(value = "{$or: [" +
                        "{'_id': 'INIT_STREAM'}, " +
                        "{'members': {$elemMatch: {'userId': ?0}}}" +
                    "]}")
    Flux<StreamTopic> findByMemberMatchUser(String userId);

}