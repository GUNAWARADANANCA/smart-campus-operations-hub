package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.BookingCreateRequest;
import com.smartcampus.hub.dto.BookingDto;
import com.smartcampus.hub.dto.BookingStatusUpdateRequest;
import com.smartcampus.hub.exception.BadRequestException;
import com.smartcampus.hub.exception.ConflictException;
import com.smartcampus.hub.exception.ForbiddenException;
import com.smartcampus.hub.exception.ResourceNotFoundException;
import com.smartcampus.hub.model.Booking;
import com.smartcampus.hub.model.BookingStatus;
import com.smartcampus.hub.model.CampusResource;
import com.smartcampus.hub.model.NotificationKind;
import com.smartcampus.hub.model.User;
import com.smartcampus.hub.model.UserRole;
import com.smartcampus.hub.repository.BookingRepository;
import com.smartcampus.hub.repository.CampusResourceRepository;
import com.smartcampus.hub.service.support.DtoMapper;
import java.time.LocalDate;
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
        return bookingRepository.findAllByOrderByDateDescStartTimeDesc()
                .stream()
                .map(DtoMapper::toBookingDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingDto findById(String id) {
        return bookingRepository.findById(id)
                .map(DtoMapper::toBookingDto)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    @Transactional
    public BookingDto create(BookingCreateRequest req) {
        User actor = currentUserService.requireUser();

        if (req.startTime() == null || req.endTime() == null ||
                !req.endTime().isAfter(req.startTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        CampusResource resource = resourceRepository.findById(req.resourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        assertNoOverlap(resource.getId(), req.date(), req.startTime(), req.endTime(), null);

        Booking entity = Booking.builder()
                .userId(actor.getId())
                .userName(actor.getName())
                .resourceId(resource.getId())
                .resourceName(resource.getName())
                .date(req.date())
                .startTime(req.startTime())
                .endTime(req.endTime())
                .status(BookingStatus.PENDING)
                .purpose(req.purpose())
                .attendees(req.attendees())
                .build();

        Booking saved = bookingRepository.save(entity);

        notificationService.notifyUser(
                actor,
                "Booking Submitted",
                "Your booking for " + resource.getName() + " on " + req.date() + " is pending approval.",
                NotificationKind.INFO
        );

        return DtoMapper.toBookingDto(saved);
    }

    @Transactional
    public BookingDto updateStatus(String id, BookingStatusUpdateRequest body) {
        User actor = currentUserService.requireUser();

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        BookingStatus next = body.status();
        BookingStatus prev = booking.getStatus();

        switch (next) {
            case APPROVED, REJECTED -> {
                if (!currentUserService.hasRole(UserRole.ADMIN)) {
                    throw new ForbiddenException("Only admins can approve/reject");
                }

                if (prev != BookingStatus.PENDING) {
                    throw new BadRequestException("Only pending bookings allowed");
                }

                if (next == BookingStatus.APPROVED) {
                    assertNoOverlap(
                            booking.getResourceId(),
                            booking.getDate(),
                            booking.getStartTime(),
                            booking.getEndTime(),
                            booking.getId()
                    );
                }
            }

            case CANCELLED -> {
                boolean owner = booking.getUserId().equals(actor.getId());

                if (!owner && !currentUserService.hasRole(UserRole.ADMIN)) {
                    throw new ForbiddenException("Cannot cancel");
                }
            }

            default -> {}
        }

        booking.setStatus(next);
        booking.setActionNote(body.actionNote());

        Booking saved = bookingRepository.save(booking);

        notificationService.notifyUser(
                actor,
                "Booking Updated",
                "Booking status changed to " + next.name(),
                NotificationKind.INFO
        );

        return DtoMapper.toBookingDto(saved);
    }

    @Transactional
    public void delete(String id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking not found");
        }
        bookingRepository.deleteById(id);
    }

    private void assertNoOverlap(
            String resourceId,
            LocalDate date,
            LocalTime start,
            LocalTime end,
            String ignoreBookingId
    ) {
        List<Booking> conflicts = bookingRepository
                .findByResourceIdAndDateAndStatusIn(resourceId, date, BLOCKING.stream().toList());

        for (Booking b : conflicts) {
            if (ignoreBookingId != null && b.getId().equals(ignoreBookingId)) {
                continue;
            }

            if (overlaps(start, end, b.getStartTime(), b.getEndTime())) {
                throw new ConflictException("Time conflict");
            }
        }
    }

    private boolean overlaps(LocalTime aStart, LocalTime aEnd, LocalTime bStart, LocalTime bEnd) {
        return aStart.isBefore(bEnd) && bStart.isBefore(aEnd);
    }
}