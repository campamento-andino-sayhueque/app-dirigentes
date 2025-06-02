package com.cas.packinglist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PackingListDto {
    private Long id;
    private List<PackingListCategoryDto> categories = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;
}
