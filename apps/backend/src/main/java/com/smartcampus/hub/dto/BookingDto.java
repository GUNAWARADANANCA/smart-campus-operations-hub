package com.smartcampus.hub.dto;

public record BookingDto(
    String id,
    String userId,
    String resourceId,
    String resourceName,
    String date,
    String startTime,
    String endTime,
    String dateTime,
    String purpose,
    Integer attendees,
    String status,
    String actionNote) {}
