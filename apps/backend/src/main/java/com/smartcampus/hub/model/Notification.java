package com.smartcampus.hub.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    private String userId;
    private String userName;

    private String title;
    private String message;
    private NotificationKind kind;
    private boolean readStatus;
    private Instant createdAt;

    public void ensureCreatedAt() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}