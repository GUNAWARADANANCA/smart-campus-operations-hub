package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ManagementUserDto;
import com.smartcampus.hub.dto.UserRoleUpdateRequest;
import com.smartcampus.hub.service.UserAdminService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserAdminService userAdminService;

  @GetMapping
  public List<ManagementUserDto> list() {
    return userAdminService.listAll();
  }

  @PutMapping("/{id}/role")
  public ManagementUserDto updateRole(
      @PathVariable String id,
      @Valid @RequestBody UserRoleUpdateRequest body) {
    return userAdminService.updateRole(id, body);
  }
}