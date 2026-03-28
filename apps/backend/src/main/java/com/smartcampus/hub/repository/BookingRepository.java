package com.smartcampus.hub.repository;

import com.smartcampus.hub.model.BookingEntity;
import com.smartcampus.hub.model.BookingStatus;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

  List<BookingEntity> findByResourceIdAndDateAndStatusIn(
      Long resourceId, LocalDate date, List<BookingStatus> statuses);

  List<BookingEntity> findAllByOrderByDateDescStartTimeDesc();
}
