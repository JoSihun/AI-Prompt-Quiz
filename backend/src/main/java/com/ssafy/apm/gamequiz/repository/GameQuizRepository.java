package com.ssafy.apm.gamequiz.repository;

import com.ssafy.apm.gamequiz.domain.GameQuizEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameQuizRepository extends CrudRepository<GameQuizEntity, Long> {
    List<GameQuizEntity> findAllByGameId(Long gameId);
}
