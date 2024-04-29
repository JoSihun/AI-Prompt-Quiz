package com.ssafy.apm.quiz.service;

import com.ssafy.apm.common.dto.request.GameChatDto;
import com.ssafy.apm.common.dto.response.GameAnswerCheck;
import com.ssafy.apm.quiz.dto.response.QuizDetailResponseDto;

import java.util.Set;

public interface QuizService {
    QuizDetailResponseDto getQuizInfo(Long quizId);

    GameAnswerCheck checkAnswer(GameChatDto answer, Set<String> checkPrompt);
}
