package com.smartcampus.hub.bootstrap;

import com.smartcampus.hub.model.BookingEntity;
import com.smartcampus.hub.model.BookingStatus;
import com.smartcampus.hub.model.CampusResourceEntity;
import com.smartcampus.hub.model.NotificationEntity;
import com.smartcampus.hub.model.NotificationKind;
import com.smartcampus.hub.model.ResourceStatus;
import com.smartcampus.hub.model.TicketEntity;
import com.smartcampus.hub.model.TicketPriority;
import com.smartcampus.hub.model.TicketStatus;
import com.smartcampus.hub.model.UserEntity;
import com.smartcampus.hub.model.UserRole;
import com.smartcampus.hub.repository.BookingRepository;
import com.smartcampus.hub.repository.CampusResourceRepository;
import com.smartcampus.hub.repository.NotificationRepository;
import com.smartcampus.hub.repository.TicketRepository;
import com.smartcampus.hub.repository.UserRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class SampleDataLoader implements CommandLineRunner {

  private final UserRepository userRepository;
  private final CampusResourceRepository resourceRepository;
  private final BookingRepository bookingRepository;
  private final TicketRepository ticketRepository;
  private final NotificationRepository notificationRepository;

  @Override
  @Transactional
  public void run(String... args) {
    if (userRepository.count() > 0) {
      return;
    }

    UserEntity admin =
        userRepository.save(
            UserEntity.builder()
                .name("Admin User")
                .email("admin@smartcampus.edu")
                .role(UserRole.ADMIN)
                .build());
    UserEntity jane =
        userRepository.save(
            UserEntity.builder()
                .name("Jane Smith")
                .email("jane@smartcampus.edu")
                .role(UserRole.USER)
                .build());
    UserEntity mike =
        userRepository.save(
            UserEntity.builder()
                .name("Mike Tech")
                .email("mike@smartcampus.edu")
                .role(UserRole.TECHNICIAN)
                .build());
    UserEntity john =
        userRepository.save(
            UserEntity.builder()
                .name("John Doe")
                .email("john@smartcampus.edu")
                .role(UserRole.USER)
                .build());
    UserEntity tom =
        userRepository.save(
            UserEntity.builder()
                .name("Tom Fix")
                .email("tom.fix@smartcampus.edu")
                .role(UserRole.TECHNICIAN)
                .build());

    CampusResourceEntity r1 =
        resourceRepository.save(
            CampusResourceEntity.builder()
                .name("Lecture Hall A-101")
                .type("Lecture Hall")
                .capacity(120)
                .location("Building A, Floor 1")
                .status(ResourceStatus.ACTIVE)
                .build());
    CampusResourceEntity r2 =
        resourceRepository.save(
            CampusResourceEntity.builder()
                .name("Computer Lab B-201")
                .type("Lab")
                .capacity(40)
                .location("Building B, Floor 2")
                .status(ResourceStatus.ACTIVE)
                .build());
    CampusResourceEntity r3 =
        resourceRepository.save(
            CampusResourceEntity.builder()
                .name("Meeting Room C-105")
                .type("Meeting Room")
                .capacity(12)
                .location("Building C, Floor 1")
                .status(ResourceStatus.ACTIVE)
                .build());
    CampusResourceEntity r4 =
        resourceRepository.save(
            CampusResourceEntity.builder()
                .name("Projector #3")
                .type("Equipment")
                .capacity(0)
                .location("Building A, Storage")
                .status(ResourceStatus.OUT_OF_SERVICE)
                .build());
    CampusResourceEntity r5 =
        resourceRepository.save(
            CampusResourceEntity.builder()
                .name("Auditorium Main")
                .type("Lecture Hall")
                .capacity(500)
                .location("Main Building, Ground")
                .status(ResourceStatus.ACTIVE)
                .build());
    CampusResourceEntity r6 =
        resourceRepository.save(
            CampusResourceEntity.builder()
                .name("Camera Kit #1")
                .type("Equipment")
                .capacity(0)
                .location("Media Center")
                .status(ResourceStatus.ACTIVE)
                .build());

    bookingRepository.save(
        BookingEntity.builder()
            .user(jane)
            .resource(r2)
            .date(LocalDate.of(2026, 4, 5))
            .startTime(LocalTime.of(9, 0))
            .endTime(LocalTime.of(11, 0))
            .status(BookingStatus.PENDING)
            .purpose("Guest Lecture")
            .attendees(35)
            .build());
    bookingRepository.save(
        BookingEntity.builder()
            .user(john)
            .resource(r3)
            .date(LocalDate.of(2026, 4, 6))
            .startTime(LocalTime.of(14, 0))
            .endTime(LocalTime.of(16, 0))
            .status(BookingStatus.APPROVED)
            .purpose("Staff Meeting")
            .attendees(8)
            .build());
    bookingRepository.save(
        BookingEntity.builder()
            .user(jane)
            .resource(r5)
            .date(LocalDate.of(2026, 4, 8))
            .startTime(LocalTime.of(10, 0))
            .endTime(LocalTime.of(12, 0))
            .status(BookingStatus.PENDING)
            .purpose("Annual Seminar")
            .attendees(200)
            .build());
    bookingRepository.save(
        BookingEntity.builder()
            .user(john)
            .resource(r4)
            .date(LocalDate.of(2026, 4, 4))
            .startTime(LocalTime.of(13, 0))
            .endTime(LocalTime.of(15, 0))
            .status(BookingStatus.REJECTED)
            .purpose("Presentation")
            .attendees(50)
            .actionNote("Resource unavailable")
            .build());
    bookingRepository.save(
        BookingEntity.builder()
            .user(john)
            .resource(r2)
            .date(LocalDate.of(2026, 4, 3))
            .startTime(LocalTime.of(8, 0))
            .endTime(LocalTime.of(10, 0))
            .status(BookingStatus.CANCELLED)
            .purpose("Lab Session")
            .attendees(30)
            .actionNote("By user")
            .build());

    TicketEntity t1 =
        ticketRepository.save(buildTicket(jane, r3, mike, "Projector not working - Room C-301"));
    t1.setTicketNumber("#1024");
    t1.setTitle("Projector not working - Room C-301");
    t1.setDescription("Equipment failure");
    t1.setCategory("Equipment Failure");
    t1.setLocationLabel("Building C, Room 301");
    t1.setPriority(TicketPriority.HIGH);
    t1.setStatus(TicketStatus.IN_PROGRESS);
    t1.setAssignedTo(mike);
    t1.setCommentCount(2);
    ticketRepository.save(t1);

    TicketEntity t2 =
        ticketRepository.save(buildTicket(john, r2, null, "AC not cooling - Lab B-201"));
    t2.setTicketNumber("#1023");
    t2.setTitle("AC not cooling - Lab B-201");
    t2.setCategory("HVAC");
    t2.setLocationLabel("Building B, Floor 2");
    t2.setPriority(TicketPriority.MEDIUM);
    t2.setStatus(TicketStatus.OPEN);
    t2.setCommentCount(0);
    ticketRepository.save(t2);

    TicketEntity t3 =
        ticketRepository.save(buildTicket(jane, r1, mike, "Broken chair - Lecture Hall A"));
    t3.setTicketNumber("#1022");
    t3.setTitle("Broken chair - Lecture Hall A");
    t3.setCategory("Furniture");
    t3.setLocationLabel("Building A, Lecture Hall");
    t3.setPriority(TicketPriority.LOW);
    t3.setStatus(TicketStatus.RESOLVED);
    t3.setAssignedTo(tom);
    t3.setCommentCount(3);
    ticketRepository.save(t3);

    TicketEntity t4 =
        ticketRepository.save(buildTicket(admin, r1, mike, "Network outage - Building D"));
    t4.setTicketNumber("#1021");
    t4.setTitle("Network outage - Building D");
    t4.setCategory("Network");
    t4.setLocationLabel("Building D");
    t4.setPriority(TicketPriority.CRITICAL);
    t4.setStatus(TicketStatus.CLOSED);
    t4.setAssignedTo(mike);
    t4.setCommentCount(8);
    ticketRepository.save(t4);

    Instant now = Instant.now();
    notificationRepository.save(
        NotificationEntity.builder()
            .user(jane)
            .title("Booking Approved")
            .message("Your booking for Computer Lab B-201 on Apr 6 has been approved.")
            .kind(NotificationKind.SUCCESS)
            .readStatus(false)
            .createdAt(now.minus(2, ChronoUnit.MINUTES))
            .build());
    notificationRepository.save(
        NotificationEntity.builder()
            .user(jane)
            .title("Ticket Status Updated")
            .message("Ticket #1024 changed to IN_PROGRESS.")
            .kind(NotificationKind.WARNING)
            .readStatus(false)
            .createdAt(now.minus(15, ChronoUnit.MINUTES))
            .build());
    notificationRepository.save(
        NotificationEntity.builder()
            .user(jane)
            .title("New Comment")
            .message("John added a comment on your ticket.")
            .kind(NotificationKind.INFO)
            .readStatus(false)
            .createdAt(now.minus(1, ChronoUnit.HOURS))
            .build());
  }

  private TicketEntity buildTicket(
      UserEntity reporter, CampusResourceEntity resource, UserEntity assignee, String title) {
    return TicketEntity.builder()
        .ticketNumber("TMP-" + UUID.randomUUID())
        .user(reporter)
        .resource(resource)
        .title(title)
        .description("")
        .category("")
        .locationLabel("")
        .priority(TicketPriority.MEDIUM)
        .status(TicketStatus.OPEN)
        .assignedTo(assignee)
        .commentCount(0)
        .build();
  }
}
