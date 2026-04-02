package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.BookingCreateRequest;
import com.smartcampus.hub.dto.BookingDto;
import com.smartcampus.hub.dto.BookingStatusUpdateRequest;
import com.smartcampus.hub.exception.BadRequestException;
import com.smartcampus.hub.exception.ConflictException;
import com.smartcampus.hub.exception.ForbiddenException;
import com.smartcampus.hub.exception.ResourceNotFoundException;
import com.smartcampus.hub.model.BookingEntity;
import com.smartcampus.hub.model.BookingStatus;
import com.smartcampus.hub.model.CampusResourceEntity;
import com.smartcampus.hub.model.NotificationKind;
import com.smartcampus.hub.model.UserEntity;
import com.smartcampus.hub.model.UserRole;
import com.smartcampus.hub.repository.BookingRepository;
import com.smartcampus.hub.repository.CampusResourceRepository;
import com.smartcampus.hub.service.support.DtoMapper;
import java.time.LocalTime;
import java.util.EnumSet;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService {

  private static final EnumSet<BookingStatus> BLOCKING =
      EnumSet.of(BookingStatus.PENDING, BookingStatus.APPROVED);

  private final BookingRepository bookingRepository;
  private final CampusResourceRepository resourceRepository;
  private final CurrentUserService currentUserService;
  private final NotificationService notificationService;

  @Transactional(readOnly = true)
  public List<BookingDto> findAll() {
    return bookingRepository.findAllByOrderByDateDescStartTimeDesc().stream()
        .map(DtoMapper::toBookingDto)
        .toList();
  }

  @Transactional(readOnly = true)
  public BookingDto findById(Long id) {
    return bookingRepository
        .findById(id)
        .map(DtoMapper::toBookingDto)
        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
  }

  @Transactional
  public BookingDto create(BookingCreateRequest req) {
    UserEntity actor = currentUserService.requireUser();
    if (req.startTime() == null
        || req.endTime() == null
        || !req.endTime().isAfter(req.startTime())) {
      throw new BadRequestException("End time must be after start time");
    }
    CampusResourceEntity resource =
        resourceRepository
            .findById(req.resourceId())
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

    assertNoOverlap(resource, req.date(), req.startTime(), req.endTime(), null);
    var entity =
        BookingEntity.builder()
            .user(actor)
            .resource(resource)
            .date(req.date())
            .startTime(req.startTime())
            .endTime(req.endTime())
            .status(BookingStatus.PENDING)
            .purpose(req.purpose())
            .attendees(req.attendees())
            .build();
    BookingEntity saved = bookingRepository.save(entity);
    notificationService.notifyUser(
        actor,
        "Booking Submitted",
        "Your booking for "
            + resource.getName()
            + " on "
            + req.date()
            + " is pending approval.",
        NotificationKind.INFO);
    return DtoMapper.toBookingDto(saved);
  }

  @Transactional
  public BookingDto updateStatus(Long id, BookingStatusUpdateRequest body) {
    UserEntity actor = currentUserService.requireUser();
    BookingEntity booking =
        bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    BookingStatus next = body.status();
    BookingStatus prev = booking.getStatus();

    switch (next) {
      case APPROVED, REJECTED -> {
        if (!currentUserService.hasRole(UserRole.ADMIN)) {
          throw new ForbiddenException("Only administrators can approve or reject bookings");
        }
        if (prev != BookingStatus.PENDING) {
          throw new BadRequestException("Only pending bookings can be approved or rejected");
        }
        if (next == BookingStatus.APPROVED) {
          assertNoOverlap(
              booking.getResource(),
              booking.getDate(),
              booking.getStartTime(),
              booking.getEndTime(),
              booking.getId());
        }
      }
      case CANCELLED -> {
        boolean owner = booking.getUser().getId().equals(actor.getId());
        if (!owner && !currentUserService.hasRole(UserRole.ADMIN)) {
          throw new ForbiddenException("You cannot cancel this booking");
        }
        if (prev != BookingStatus.PENDING && prev != BookingStatus.APPROVED) {
          throw new BadRequestException("Only pending or approved bookings can be cancelled");
        }
      }
      case PENDING -> throw new BadRequestException("Cannot revert booking to PENDING");
      default -> throw new BadRequestException("Unsupported transition");
    }

    booking.setStatus(next);
    booking.setActionNote(body.actionNote());
    BookingEntity saved = bookingRepository.save(booking);

    NotificationKind kind =
        next == BookingStatus.APPROVED
            ? NotificationKind.SUCCESS
            : next == BookingStatus.REJECTED ? NotificationKind.WARNING : NotificationKind.INFO;
    notificationService.notifyUser(
        booking.getUser(),
        "Booking " + next.name(),
        "Booking for "
            + booking.getResource().getName()
            + " "
            + next.name().toLowerCase().replace('_', ' ')
            + ".",
        kind);
    return DtoMapper.toBookingDto(saved);
  }

  @Transactional
  public void delete(Long id) {
    if (!bookingRepository.existsById(id)) {
      throw new ResourceNotFoundException("Booking not found");
    }
    bookingRepository.deleteById(id);
  }

  private void assertNoOverlap(
      CampusResourceEntity resource,
      java.time.LocalDate date,
      LocalTime start,
      LocalTime end,
      Long ignoreBookingId) {
    List<BookingEntity> conflicts =
        bookingRepository.findByResourceIdAndDateAndStatusIn(
            resource.getId(), date, BLOCKING.stream().toList());
    for (BookingEntity b : conflicts) {
      if (ignoreBookingId != null && b.getId().equals(ignoreBookingId)) {
        continue;
      }
      if (overlaps(start, end, b.getStartTime(), b.getEndTime())) {
        throw new ConflictException("Time conflict with another booking for this resource");
      }
    }
  }

  private boolean overlaps(LocalTime aStart, LocalTime aEnd, LocalTime bStart, LocalTime bEnd) {
    return aStart.isBefore(bEnd) && bStart.isBefore(aEnd);
  }
}
