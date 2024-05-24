package com.flo.qushift.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.Objects;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
public class Member {
    private String userId;

    private String username;

    private Boolean checkSeen = false;

    private Integer notSeenCount = 0;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Member member = (Member) o;
        return Objects.equals(userId, member.userId) && Objects.equals(username, member.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, username);
    }
}
