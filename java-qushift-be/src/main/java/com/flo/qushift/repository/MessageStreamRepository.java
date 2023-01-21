package com.flo.qushift.repository;

import com.flo.qushift.document.Message;
import com.flo.qushift.document.StreamMessage;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface MessageStreamRepository extends ReactiveMongoRepository<StreamMessage, String> {
    @Tailable
    Flux<StreamMessage> findByTopicId(String topicId);

    @Tailable
    @Query(value = "{$or: [{'receiver': {$in: [?0]}}, " +
            "               {'sender': {$in: [?1]}}]}")
    Flux<Message> findByReceiverOrSender(String receiverId, String senderId);
}