package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.BookingCreateRequest;
import com.smartcampus.hub.dto.BookingDto;
import com.smartcampus.hub.dto.BookingStatusUpdateRequest;
import com.smartcampus.hub.service.BookingService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

  private final BookingService bookingService;

  @GetMapping
  public List<BookingDto> list() {
    return bookingService.findAll();
  }

  @GetMapping("/{id}")
  public BookingDto get(@PathVariable Long id) {
    return bookingService.findById(id);
  }

  @PostMapping
  public BookingDto create(@Valid @RequestBody BookingCreateRequest body) {
    return bookingService.create(body);
  }

  @PutMapping("/{id}/status")
  public BookingDto updateStatus(
      @PathVariable Long id, @Valid @RequestBody BookingStatusUpdateRequest body) {
    return bookingService.updateStatus(id, body);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    bookingService.delete(id);
  }
}
