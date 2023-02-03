package com.flo.qushift.repository;

import com.flo.qushift.document.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface ReactiveMessageRepository extends ReactiveMongoRepository<Message, String> {

    Flux<Message> findAllByTopicId(String topicId, String userId, Pageable pageable);

    Flux<Message> findAllByTopicId(String topicId);
}