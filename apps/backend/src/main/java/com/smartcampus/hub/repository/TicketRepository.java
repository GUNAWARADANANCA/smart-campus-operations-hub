package com.smartcampus.hub.repository;

import com.smartcampus.hub.model.TicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<TicketEntity, Long> {

  java.util.List<TicketEntity> findAllByOrderByIdDesc();
}
