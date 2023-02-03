package com.flo.qushift.controller;

import com.flo.qushift.document.Topic;
import com.flo.qushift.dto.TopicDto;
import com.flo.qushift.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
    public Flux<Topic> retrieveTopics(@RequestParam String userId,
                                      @RequestParam Integer start,
                                      @RequestParam Integer size) {
        return topicService.getPaginatedTopics(userId, start, size);
    }

    @GetMapping(value = "/{topicId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<Topic>> retrieveTopic(@PathVariable String topicId, @RequestParam String userId) {
        return topicService.getTopicByUser(topicId, userId)
                .map(ResponseEntity::ok);
    }

    @GetMapping(value = "/stream/{receiverId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Topic> retrieveMessagesForReceiver(@PathVariable String receiverId) {
        return topicService.getStreamMessagesByReceiver(receiverId);
    }

    @PutMapping("/signal/{topicId}")
    public Mono<ResponseEntity<HttpStatus>> sendSignalForSeen(@PathVariable String topicId, @RequestParam String userId) {
        return topicService.changeCheckSeenTopicForMember(topicId, userId)
                .map(s -> ResponseEntity.ok(HttpStatus.ACCEPTED));
    }
}
