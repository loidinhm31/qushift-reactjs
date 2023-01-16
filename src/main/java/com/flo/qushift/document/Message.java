package com.flo.qushift.document;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@SuperBuilder
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "messages")
public class Message extends BaseDocument {
    @Id
    private String id;

    private String sender;

    private String receiver;

    private String content;

    @NonNull
    private String topicId;
}