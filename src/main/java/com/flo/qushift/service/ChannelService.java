package com.flo.qushift.service;

import com.flo.qushift.document.Channel;
import com.flo.qushift.dto.ChannelDto;
import com.flo.qushift.repository.ChannelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class ChannelService {

    private final ChannelRepository channelRepository;

    public Mono<Channel> saveChannel(ChannelDto channelDto) {
        Channel channel = Channel.builder()
                .name(channelDto.getName())
                .createdAt(LocalDateTime.now())
                .build();

        return channelRepository.save(channel);
    }
}
