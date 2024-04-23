package com.ssafy.apm.user.controller;

import com.ssafy.apm.common.domain.ResponseData;
import com.ssafy.apm.user.dto.*;
import com.ssafy.apm.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody UserCreateRequestDto requestDto){
        UserDetailResponseDto responseDto = userService.createUser(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success(responseDto));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginRequestDto requestDto){
//        log.debug("controller : {}",requestDto.toString() );
        UserLoginResponseDto responseDto = userService.loginUser(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @GetMapping("/exist")
    public ResponseEntity<?> isExistUser(@RequestParam String userName){
        Boolean response = userService.isExistUserName(userName);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(response));
    }

    @GetMapping("")
    public ResponseEntity<?> getUserInfo(){
        UserDetailResponseDto responseDto = userService.readUser();
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String,String> requestBody){
        UserDetailResponseDto responseDto =  userService.updateProfile(requestBody.get("profileUrl"));
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @PutMapping("/status-message")
    public ResponseEntity<?> updateStatusMessage(@RequestBody Map<String,String> requestBody ){
        UserDetailResponseDto responseDto = userService.updateStatusMessage(requestBody.get("message"));
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @PutMapping("/score")
    public ResponseEntity<?> updateScore(@RequestBody UserScoreUpdateRequestDto requestDto){
        UserDetailResponseDto responseDto = userService.updateUserScore(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }
}