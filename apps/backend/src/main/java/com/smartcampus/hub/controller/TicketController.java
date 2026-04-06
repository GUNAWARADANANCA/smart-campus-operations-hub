package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.TicketCreateRequest;
import com.smartcampus.hub.dto.TicketDto;
import com.smartcampus.hub.dto.TicketStatusUpdateRequest;
import com.smartcampus.hub.service.TicketService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

  private final TicketService ticketService;

  @GetMapping
  public List<TicketDto> list() {
    return ticketService.findAll();
  }

  @GetMapping("/{id}")
  public TicketDto get(@PathVariable String id) {
    return ticketService.findById(id);
  }

  @PostMapping
  public TicketDto create(@Valid @RequestBody TicketCreateRequest body) {
    return ticketService.create(body);
  }

  @PatchMapping("/{id}/advance")
  public TicketDto advance(@PathVariable String id) {
    return ticketService.advance(id);
  }

  @PutMapping("/{id}/status")
  public TicketDto updateStatus(
      @PathVariable String id, @Valid @RequestBody TicketStatusUpdateRequest body) {
    return ticketService.updateStatus(id, body);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable String id) {
    ticketService.delete(id);
  }
}
