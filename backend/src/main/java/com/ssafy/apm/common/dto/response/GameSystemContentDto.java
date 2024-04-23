package com.ssafy.apm.common.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class GameSystemContentDto {
    // 퀴즈 아이디 - 게임에서 현재 라운드 가져와서 퀴즈 값 넣어주기
    // 초기값 0
    private Long quizId;
    
    // (라운드 결과) 유저 리스트 , null 값 일 수 있음
    private List<PlayerDto> roundList;
}