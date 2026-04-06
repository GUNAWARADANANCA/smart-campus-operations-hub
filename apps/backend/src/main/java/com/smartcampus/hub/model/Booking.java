package com.smartcampus.hub.model;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    private String id;

    private String userId;
    private String userName;

    private String resourceId;
    private String resourceName;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private BookingStatus status;
    private String purpose;
    private Integer attendees;
    private String actionNote;
}