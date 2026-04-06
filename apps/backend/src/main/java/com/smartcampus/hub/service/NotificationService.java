package com.smartcampus.hub.service;

import com.smartcampus.hub.model.Notification;
import com.smartcampus.hub.model.NotificationKind;
import com.smartcampus.hub.model.User;
import com.smartcampus.hub.repository.NotificationRepository;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

  private final NotificationRepository notificationRepository;

  @Transactional
  public void notifyUser(User user, String title, String message, NotificationKind kind) {
    notificationRepository.save(
        Notification.builder()
            .userId(user.getId())
            .userName(user.getName())
            .title(title)
            .message(message)
            .kind(kind)
            .readStatus(false)
            .createdAt(Instant.now())
            .build());
  }
}
