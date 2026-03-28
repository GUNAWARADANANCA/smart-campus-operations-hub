package com.smartcampus.hub.dto;

public record ResourceDto(
    String id,
    String name,
    String type,
    Integer capacity,
    String location,
    String status) {}
