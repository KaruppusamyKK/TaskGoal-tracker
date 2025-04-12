package com.trackIt.api.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest {
    private List<String> users;

    @Override
    public String toString() {
        return "NotificationRequest{users=" + users + "}";
    }
}
