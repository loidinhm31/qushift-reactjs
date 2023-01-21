package com.flo.qushift.dto;

import lombok.Data;

@Data
public class MessageDto {
    private String sender;

    private String receiver;

    private String content;

    private String topicId;
}
