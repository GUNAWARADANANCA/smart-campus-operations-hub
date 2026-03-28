package com.smartcampus.hub.dto;

public record ManagementUserDto(
    String id,
    String name,
    String email,
    String role,
    String joined,
    String initial,
    String avatarClass) {}
