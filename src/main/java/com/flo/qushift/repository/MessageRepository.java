package com.flo.qushift.repository;

import com.flo.qushift.document.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface MessageRepository extends ReactiveMongoRepository<Message, String> {
    @Tailable
    Flux<Message> findAllByChannelId(String channelId);

    Flux<Message> findAllByChannelId(String channelId, Pageable pageable);
}