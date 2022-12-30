package com.flo.qushift.controller;

import com.flo.qushift.document.Channel;
import com.flo.qushift.dto.ChannelDto;
import com.flo.qushift.service.ChannelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@RestController
@RequestMapping("/channels")
public class ChannelController {

    private final ChannelService channelService;

    @PostMapping
    public Mono<Channel> createChannel(@RequestBody ChannelDto channelDto) {
        return channelService.saveChannel(channelDto);
    }
}
