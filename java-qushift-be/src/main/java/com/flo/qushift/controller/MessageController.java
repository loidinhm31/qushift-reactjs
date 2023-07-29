package com.flo.qushift.controller;


import com.flo.qushift.document.Message;
import com.flo.qushift.document.StreamMessage;
import com.flo.qushift.dto.MessageDto;
import com.flo.qushift.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/messages")
public class MessageController {
    private final MessageService messageService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ResponseEntity<HttpStatus>> pushMessage(@RequestBody MessageDto messageDto) {
        return messageService.saveMessage(messageDto)
                .map(m -> ResponseEntity.ok(HttpStatus.CREATED));
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<StreamMessage> streamMessages(@RequestParam String topicId) {
        return messageService.getStreamMessagesByTopic(topicId);
    }

    @GetMapping(produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Mono<ResponseEntity<List<Message>>> retrieveMessages(@RequestParam String topicId,
                                                               @RequestParam Integer start,
                                                               @RequestParam Integer size,
                                                               @RequestParam String userId) {
        // TODO remove userId when using authentication
        return messageService.getPaginatedMessages(topicId, start, size, userId)
                .collectList()
                .map(ResponseEntity::ok);
    }
}