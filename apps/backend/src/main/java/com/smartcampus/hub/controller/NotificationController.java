package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.NotificationDto;
import com.smartcampus.hub.service.NotificationReadService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

  private final NotificationReadService notificationReadService;

  @GetMapping
  public List<NotificationDto> list() {
    return notificationReadService.listMine();
  }

  @PutMapping("/read-all")
  public void markAllRead() {
    notificationReadService.markAllRead();
  }

  @PutMapping("/{id}/read")
  public void markRead(@PathVariable Long id) {
    notificationReadService.markRead(id);
  }
}
