package com.smartcampus.hub.dto;

public record NotificationDto(
    String id, String title, String body, String time, String kind, boolean read) {}
