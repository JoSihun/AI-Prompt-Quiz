package com.ssafy.apm.game.service;

import com.ssafy.apm.game.domain.Game;
import com.ssafy.apm.gamequiz.domain.GameQuiz;
import com.ssafy.apm.quiz.domain.Quiz;
import com.ssafy.apm.quiz.exception.QuizNotFoundException;
import com.ssafy.apm.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BlankChoiceService {

    private final QuizRepository quizRepository;

    public List<GameQuiz> createGameQuizList(Game gameEntity, Integer gameType, List<Quiz> quizList) {
        List<GameQuiz> response = new ArrayList<>();
        int curRound = 1;
        for (Quiz quiz : quizList) { // 각 퀴즈마다 4가지 문제가 생성되야함
            GameQuiz entity = GameQuiz.builder() // 정답
                    .gameCode(gameEntity.getCode())
                    .quizId(quiz.getId())
                    .type(gameType)
                    .round(curRound)
                    .isAnswer(true)
                    .build();
            response.add(entity);
            List<Quiz> randomQuizList = quizRepository.extractRandomQuizzesByStyle(quiz.getStyle(), 3) // 같은 스타일의 quiz 찾아
                    .orElseThrow(() -> new QuizNotFoundException("No entities exists by style!"));

            for (Quiz wrong : randomQuizList) {
                entity = GameQuiz.builder() // 오답
                        .gameCode(gameEntity.getCode())
                        .quizId(wrong.getId())
                        .type(gameType)
                        .round(curRound)
                        .isAnswer(false)
                        .build();
                response.add(entity);
            }
            curRound++;
        }
        return response;
    }

    public List<GameQuiz> createGameQuiz(Game gameEntity, Quiz quiz, int curRound) {
        List<GameQuiz> response = new ArrayList<>();

        GameQuiz entity = GameQuiz.builder() // 정답
                .gameCode(gameEntity.getCode())
                .quizId(quiz.getId())
                .type(2)
                .round(curRound)
                .isAnswer(true)
                .build();
        response.add(entity);

        List<Quiz> randomQuizList = quizRepository.extractRandomQuizzesByStyle(quiz.getStyle(), 3) // 같은 스타일의 quiz 찾아
                .orElseThrow(() -> new QuizNotFoundException("No entities exists by style!"));

        for (Quiz wrong : randomQuizList) {
            entity = GameQuiz.builder() // 오답
                    .gameCode(gameEntity.getCode())
                    .quizId(wrong.getId())
                    .type(2)
                    .round(curRound)
                    .isAnswer(false)
                    .build();
            response.add(entity);
        }
        return response;
    }
}