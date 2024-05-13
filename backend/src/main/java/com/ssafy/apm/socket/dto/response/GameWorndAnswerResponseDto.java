package com.ssafy.apm.socket.dto.response;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class GameWorndAnswerResponseDto {
    private Long userId;
    private String answer;
}
