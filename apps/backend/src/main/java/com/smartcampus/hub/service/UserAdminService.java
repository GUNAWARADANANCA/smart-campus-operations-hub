package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.ManagementUserDto;
import com.smartcampus.hub.dto.UserRoleUpdateRequest;
import com.smartcampus.hub.exception.ForbiddenException;
import com.smartcampus.hub.exception.ResourceNotFoundException;
import com.smartcampus.hub.model.UserRole;
import com.smartcampus.hub.model.NotificationKind;
import com.smartcampus.hub.repository.UserRepository;
import com.smartcampus.hub.service.support.DtoMapper;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserAdminService {

  private final UserRepository userRepository;
  private final CurrentUserService currentUserService;
  private final NotificationService notificationService;

  @Transactional(readOnly = true)
  public List<ManagementUserDto> listAll() {
    requireAdmin();
    return userRepository.findAll().stream()
        .map(DtoMapper::toManagementUser)
        .sorted(Comparator.comparingLong(a -> Long.parseLong(a.id())))
        .toList();
  }

  @Transactional
  public ManagementUserDto updateRole(Long userId, UserRoleUpdateRequest body) {
    requireAdmin();
    var user =
        userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    user.setRole(body.role());
    userRepository.save(user);
    notificationService.notifyUser(
        user,
        "Role Updated",
        "Your campus role was changed to " + body.role().name() + ".",
        NotificationKind.INFO);
    return DtoMapper.toManagementUser(user);
  }

  private void requireAdmin() {
    if (!currentUserService.hasRole(UserRole.ADMIN)) {
      throw new ForbiddenException("Only administrators can manage users");
    }
  }
}
