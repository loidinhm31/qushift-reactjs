package com.flo.qushift.controller;

import com.flo.qushift.document.Topic;
import com.flo.qushift.dto.TopicDto;
import com.flo.qushift.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@RestController
@RequestMapping("/topics")
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    public Mono<Topic> createChannel(@RequestBody TopicDto topicDto) {
        return topicService.saveChannel(topicDto);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<Topic> retrieveChannels(@RequestParam String userId,
                                        @RequestParam Integer start,
                                        @RequestParam Integer size) {
        Flux<Topic> channelFlux = topicService.getPaginatedTopics(userId, start, size);
        return channelFlux;
    }

    @GetMapping(value = "/stream/{receiverId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Topic> retrieveMessagesForReceiver(@PathVariable String receiverId) {
        return topicService.getTailMessagesByReceiver(receiverId);
    }

    @PostMapping("/signal/{topicId}")
    public Mono<Void> sendSignalForSeen(@PathVariable String topicId) {
        return topicService.changeCheckSeenTopicForMember(topicId);
    }
}
