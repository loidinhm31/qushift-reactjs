package com.flo.qushift.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flo.qushift.document.StreamTopic;
import com.flo.qushift.document.Topic;
import com.flo.qushift.dto.TopicDto;
import com.flo.qushift.service.TopicService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@RestController
@RequestMapping("/topics")
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    public Mono<ResponseEntity<StreamTopic>> createTopic(@RequestBody TopicDto topicDto) {
        return topicService.saveTopic(topicDto)
                .map(ResponseEntity::ok);
    }

    @GetMapping(produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Mono<ResponseEntity<List<Topic>>> retrieveTopics(@RequestParam Integer start,
                                                            @RequestParam Integer size,
                                                            @RequestParam String userId) {
        // TODO remove userId when not using
        return topicService.getPaginatedTopics(start, size, userId)
                .collectList()
                .map(ResponseEntity::ok);
    }

    @GetMapping(value = "/{topicId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<Topic>> retrieveTopic(@PathVariable String topicId, @RequestParam String userId) {
        return topicService.getTopicByUser(topicId, userId)
                .map(ResponseEntity::ok);
    }

    @GetMapping(value = "/stream/{receiverId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<StreamTopic> retrieveMessagesForReceiver(@PathVariable String receiverId) {
        return topicService.getStreamMessagesByReceiver(receiverId);
    }

    @PutMapping("/signal/{topicId}")
    public Mono<ResponseEntity<HttpStatus>> sendSignalForSeen(@PathVariable String topicId, @RequestParam String userId) {
        return topicService.changeCheckSeenTopicForMember(topicId, userId)
                .map(s -> ResponseEntity.ok(HttpStatus.ACCEPTED));
    }
}
