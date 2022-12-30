package com.flo.qushift.repository;

import com.flo.qushift.document.Channel;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface ChannelRepository extends ReactiveMongoRepository<Channel, String> {

}
