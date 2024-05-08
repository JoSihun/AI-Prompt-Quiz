package com.ssafy.apm.gamequiz.repository;

import com.ssafy.apm.gamequiz.domain.GameQuiz;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameQuizRepository extends CrudRepository<GameQuiz, String> {
    Optional<List<GameQuiz>> findAllByGameCode(String gameCode);
    Optional<List<GameQuiz>> findAllByGameCodeAndRound(String gameCode, Integer round);
    Optional<GameQuiz> findFirstByGameCodeAndRound(String gameCode, Integer round);

}
