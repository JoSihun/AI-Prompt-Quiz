package com.ssafy.apm.user.service;

import com.ssafy.apm.common.domain.JwtProvider;
import com.ssafy.apm.user.domain.User;
import com.ssafy.apm.user.dto.*;
import com.ssafy.apm.user.exceptions.UserNotFoundException;
import com.ssafy.apm.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Override
    public User loadUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated()){
            throw new UserNotFoundException("forbidden");
        }
        return (User) authentication.getPrincipal();
    }

    @Override
    public UserDetailResponseDto createUser(UserCreateRequestDto requestDto) {
        User user = requestDto.toEntity();
        user.encodePassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return new UserDetailResponseDto(user);
    }

    @Override
    public UserDetailResponseDto readUser() {
        User user = this.loadUser();
        return new UserDetailResponseDto(user);
    }

//    @Override
//    public UserDetailResponseDto updateUser(UserUpdateRequestDto requestDto) {
//        User user = userRepository.findById(requestDto.getUserId())
//                .orElseThrow(() -> new UserNotFoundException(requestDto.getUserId()));
//        userRepository.save(user);
//        return new UserDetailResponseDto(user);
//    }
//
//    @Override
//    public UserDetailResponseDto deleteUser(Long userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new UserNotFoundException(userId));
//        userRepository.delete(user);
//        return new UserDetailResponseDto(user);
//    }

    @Override
    public UserLoginResponseDto loginUser(UserLoginRequestDto requestDto) {
        log.debug("service : {}", requestDto.toString());
        User user = userRepository.findByUserName(requestDto.getUserName())
                .orElseThrow(() -> new UserNotFoundException("not found user"));
        if(!passwordEncoder.matches(requestDto.getPassword(), user.getPassword())){
            throw new UserNotFoundException(user.getId());
        }
        String accessToken = jwtProvider.createAccessToken(user.getId(), "ROLE_USER");
        return new UserLoginResponseDto(user.getId(),accessToken);
    }

    @Override
    public Boolean isExistUserName(String userName) {
        return userRepository.findByUserName(userName).isPresent();
    }

    @Override
    public UserDetailResponseDto updateProfile(String profileUrl) {
        User user = this.loadUser();
        user.updateProfile(profileUrl);
        userRepository.save(user);
        return new UserDetailResponseDto(user);
    }

    @Override
    public UserDetailResponseDto updateStatusMessage(String message) {
        User user = this.loadUser();
        user.updateStatusMessage(message);
        userRepository.save(user);
        return new UserDetailResponseDto(user);
    }

    @Override
    public UserDetailResponseDto updateUserScore(UserScoreUpdateRequestDto requestDto) {
        User user = this.loadUser();
        user.updateScore(requestDto);
        userRepository.save(user);
        return new UserDetailResponseDto(user);
    }
}