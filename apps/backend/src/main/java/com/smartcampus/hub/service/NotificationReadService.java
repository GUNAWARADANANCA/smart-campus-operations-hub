package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.NotificationDto;
import com.smartcampus.hub.exception.ResourceNotFoundException;
import com.smartcampus.hub.repository.NotificationRepository;
import com.smartcampus.hub.service.support.DtoMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationReadService {

  private final NotificationRepository notificationRepository;
  private final CurrentUserService currentUserService;

  @Transactional(readOnly = true)
  public List<NotificationDto> listMine() {
    var user = currentUserService.requireUser();
    return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
        .map(DtoMapper::toNotificationDto)
        .toList();
  }

  @Transactional
  public void markAllRead() {
    var user = currentUserService.requireUser();
    var notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
    notifications.forEach(n -> n.setReadStatus(true));
    notificationRepository.saveAll(notifications);
  }

  @Transactional
  public void markRead(Long id) {
    var user = currentUserService.requireUser();
    var n =
        notificationRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
    if (!n.getUser().getId().equals(user.getId())) {
      throw new ResourceNotFoundException("Notification not found");
    }
    n.setReadStatus(true);
    notificationRepository.save(n);
  }
}
