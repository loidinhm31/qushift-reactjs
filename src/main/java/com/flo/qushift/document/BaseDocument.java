package com.flo.qushift.document;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@SuperBuilder
@Data
@NoArgsConstructor
public abstract class BaseDocument {

    @CreatedDate
    private LocalDateTime createdAt;
}
