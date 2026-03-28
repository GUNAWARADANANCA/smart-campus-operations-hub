package com.smartcampus.hub.dto;

import com.smartcampus.hub.model.UserRole;
import jakarta.validation.constraints.NotNull;

public record UserRoleUpdateRequest(@NotNull UserRole role) {}
