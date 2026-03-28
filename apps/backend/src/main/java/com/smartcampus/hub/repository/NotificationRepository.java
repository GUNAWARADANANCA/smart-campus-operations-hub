package com.smartcampus.hub.repository;

import com.smartcampus.hub.model.NotificationEntity;
import com.smartcampus.hub.model.UserEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

  List<NotificationEntity> findByUserOrderByCreatedAtDesc(UserEntity user);
}
