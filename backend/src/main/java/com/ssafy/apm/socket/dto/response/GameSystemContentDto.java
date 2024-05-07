package com.ssafy.apm.socket.dto.response;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class GameSystemContentDto {

    private Integer round;
    private List<PlayerDto> roundList;

    public GameSystemContentDto(Integer round){
        this.round = round;
        this.roundList = null;
    }

    public GameSystemContentDto(List<PlayerDto> roundList){
        this.round = 0;
        this.roundList = roundList;
    }

}
