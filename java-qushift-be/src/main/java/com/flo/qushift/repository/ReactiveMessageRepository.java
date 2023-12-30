package com.flo.qushift.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.flo.qushift.document.Message;

import reactor.core.publisher.Flux;

public interface ReactiveMessageRepository extends ReactiveMongoRepository<Message, String> {

    Flux<Message> findAllByTopicId(String topicId, String userId, Pageable pageable);

    Flux<Message> findAllByTopicId(String topicId);
}