package com.ssafy.apm.game.repository;

import com.ssafy.apm.game.domain.GameEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends CrudRepository<GameEntity, Long> {
    List<GameEntity> findAllByChannelId(Long channelId);

    Optional<GameEntity> findByCode(String code);
}
