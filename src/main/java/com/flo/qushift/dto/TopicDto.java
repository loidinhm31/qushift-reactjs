package com.flo.qushift.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.flo.qushift.model.Member;
import lombok.Data;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class TopicDto {
    private String name;

    private List<Member> members;
}
