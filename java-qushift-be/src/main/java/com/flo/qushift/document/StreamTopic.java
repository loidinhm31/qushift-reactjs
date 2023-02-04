package com.flo.qushift.document;

import com.flo.qushift.model.Member;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

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