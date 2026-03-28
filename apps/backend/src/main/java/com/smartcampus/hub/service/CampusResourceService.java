package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.ResourceCreateRequest;
import com.smartcampus.hub.dto.ResourceDto;
import com.smartcampus.hub.dto.ResourceUpdateRequest;
import com.smartcampus.hub.exception.ForbiddenException;
import com.smartcampus.hub.exception.ResourceNotFoundException;
import com.smartcampus.hub.model.UserRole;
import com.smartcampus.hub.model.CampusResourceEntity;
import com.smartcampus.hub.repository.CampusResourceRepository;
import com.smartcampus.hub.service.support.DtoMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CampusResourceService {

  private final CampusResourceRepository resourceRepository;
  private final CurrentUserService currentUserService;

  @Transactional(readOnly = true)
  public List<ResourceDto> findAll() {
    return resourceRepository.findAll().stream().map(DtoMapper::toResourceDto).toList();
  }

  @Transactional(readOnly = true)
  public ResourceDto findById(Long id) {
    return resourceRepository
        .findById(id)
        .map(DtoMapper::toResourceDto)
        .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
  }

  @Transactional
  public ResourceDto create(ResourceCreateRequest req) {
    requireAdmin();
    var entity =
        CampusResourceEntity.builder()
            .name(req.name())
            .type(req.type())
            .capacity(req.capacity())
            .location(req.location())
            .status(req.status())
            .build();
    return DtoMapper.toResourceDto(resourceRepository.save(entity));
  }

  @Transactional
  public ResourceDto update(Long id, ResourceUpdateRequest req) {
    requireAdmin();
    var entity =
        resourceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
    entity.setName(req.name());
    entity.setType(req.type());
    entity.setCapacity(req.capacity());
    entity.setLocation(req.location());
    entity.setStatus(req.status());
    return DtoMapper.toResourceDto(resourceRepository.save(entity));
  }

  @Transactional
  public void delete(Long id) {
    requireAdmin();
    if (!resourceRepository.existsById(id)) {
      throw new ResourceNotFoundException("Resource not found");
    }
    resourceRepository.deleteById(id);
  }

  private void requireAdmin() {
    if (!currentUserService.hasRole(UserRole.ADMIN)) {
      throw new ForbiddenException("Only administrators can manage resources");
    }
  }
}
