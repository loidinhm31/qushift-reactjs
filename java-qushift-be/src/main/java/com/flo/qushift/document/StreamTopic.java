package com.flo.qushift.document;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.flo.qushift.model.Member;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "stream-topics")
public class StreamTopic extends BaseDocument {

    @Id
    private String id;

    private String originId;

    private Boolean isNew = false;

    private String name;

    private List<Member> members;

}