package com.flo.qushift.service;

import com.flo.qushift.document.Channel;
import com.flo.qushift.document.Message;
import com.flo.qushift.dto.MessageDto;
import com.flo.qushift.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public Mono<Message> saveMessage(MessageDto messageDto) {
        Channel channel = Channel.builder()
                .id(messageDto.getChannelId())
                .build();

        Message message = Message.builder()
                .channelId(messageDto.getChannelId())
                .sender(messageDto.getSender())
                .receiver(messageDto.getReceiver())
                .content(messageDto.getContent())
                .createdAt(LocalDateTime.now())
                .build();

        return messageRepository.save(message);
    }

    public Mono<Void> deleteMessage(Message message) {
        return messageRepository.delete(message);
    }

    public Flux<Message> getTailMessages(String channelId) {
        return messageRepository.findAllByChannelId(channelId);
    }

    public Flux<Message> getPaginatedMessages(String channelId, int start, int pageSize) {
        return messageRepository.findAllByChannelId(channelId, PageRequest.of(start, pageSize));
    }
}
