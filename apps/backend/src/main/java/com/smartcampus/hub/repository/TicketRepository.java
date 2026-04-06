package com.smartcampus.hub.repository;

import com.smartcampus.hub.model.Ticket;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findAllByOrderByIdDesc();
}