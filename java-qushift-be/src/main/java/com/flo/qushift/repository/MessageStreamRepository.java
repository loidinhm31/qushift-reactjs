package com.flo.qushift.repository;

import com.flo.qushift.document.Message;
import com.flo.qushift.document.StreamMessage;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.List;

@Repository
public interface MessageStreamRepository extends ReactiveMongoRepository<StreamMessage, String> {
    @Tailable
    Flux<StreamMessage> findByTopicIdIn(List<String> values);

    @Tailable
    Flux<StreamMessage> findAllByTopicIdNotNull();

    @Tailable
    @Query(value = "{$or: [{'topicId': 'INIT_STREAM'}, " +
            "              {'receiver': {$in: [?0]}}, " +
            "              {'sender': {$in: [?1]}}]}")
    Flux<StreamMessage> findByReceiverOrSender(String receiverId, String senderId);
}