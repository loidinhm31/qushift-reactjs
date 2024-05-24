package com.flo.qushift.document;

import com.flo.qushift.model.Member;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@SuperBuilder
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "topics")
public class Topic extends BaseDocument {
    @Id
    private String id;

    private String name;

    private Set<Member> members;

}
