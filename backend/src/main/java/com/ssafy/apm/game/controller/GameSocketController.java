package com.ssafy.apm.game.controller;

import com.ssafy.apm.socket.dto.response.*;
import com.ssafy.apm.chat.service.ChatService;
import com.ssafy.apm.game.service.GameService;
import com.ssafy.apm.common.util.GameRoomStatus;
import com.ssafy.apm.common.domain.ResponseData;
import com.ssafy.apm.game.service.GameAnswerService;
import com.ssafy.apm.socket.dto.request.GameReadyDto;
import com.ssafy.apm.gameuser.service.GameUserService;
import com.ssafy.apm.gamequiz.service.GameQuizService;
import com.ssafy.apm.game.service.BlankSubjectiveService;
import com.ssafy.apm.game.exception.GameNotFoundException;
import com.ssafy.apm.socket.dto.request.GameChatRequestDto;
import com.ssafy.apm.socket.dto.request.EnterUserMessageDto;
import com.ssafy.apm.gamemonitor.service.GameMonitorService;
import com.ssafy.apm.gameuser.dto.response.GameUserSimpleResponseDto;
import com.ssafy.apm.gamequiz.dto.response.GameQuizDetailResponseDto;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"*"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.POST}, maxAge = 6000)
public class GameSocketController {

    private final ChatService chatService;
    private final GameService gameService;
    private final GameQuizService gameQuizService;
    private final GameUserService gameUserService;
    private final GameAnswerService gameAnswerService;
    private final GameMonitorService gameMonitorService;
    private final BlankSubjectiveService blankSubjectiveService;
    private final SimpMessagingTemplate template;

    private static final int REST_TIME = 3, READY_TIME = 2;
    private static final String ENDPOINT = "/ws/sub/game?uuid=";
    private static final int MULTIPLECHOICE = 1, BLANKCHOICE = 2, BLANKSUBJECTIVE = 4;

    // 라운드 끝나고 대기중인 리스트 (REST_TIME 초 대기)
    private static final HashMap<String, GameRoomStatus> gameEndMap = new HashMap<>();
    // 라운드 끝나고 결과확인 리스트 (REST_TIME 초 대기)
    private static final HashMap<String, GameRoomStatus> gameReadyMap = new HashMap<>();
    // 현재 게임 진행중인 리스트 (max_time 초 대기)
    private static final HashMap<String, GameRoomStatus> gameOngoingMap = new HashMap<>();

    @Scheduled(fixedRate = 36000)
    private void saveCurrentGameList() {
        gameMonitorService.saveRoomList();
    }

    @Scheduled(fixedRate = 1000)
    private void roundOngoingScheduler() {

        List<GameRoomStatus> list = new ArrayList<>(gameOngoingMap.values());
        for (GameRoomStatus game : list) {
            if (!gameOngoingMap.containsKey(game.gameCode) || game.round < 0) continue;
            try {
                if (game.time <= 0) {
                    if (game.time == 0) {
                        sendRoundEndMessage(game, -1L);
                        setRoundToEnd(game);
                    }
                    gameEndMap.put(game.gameCode, game);
                    gameOngoingMap.remove(game.gameCode);
                    game.time = REST_TIME;
                } else {
                    if (game.time == game.maxTime / 2 && gameQuizService.getCurrentGameQuizTypeByGameCode(game.gameCode) == BLANKSUBJECTIVE) {
                        GameQuizDetailResponseDto quiz = gameQuizService.findFirstCurrentDetailGameQuizByGameCode(game.gameCode);
                        quiz = blankSubjectiveService.setInitialSound(quiz);
                        game.addInitialSound(quiz);
                        sendMessage(game.gameCode, new GameResponseDto("similarity", new GameBlankResponseDto(game, quiz.getUrl())));
                    }

                    sendTimerMessage(game, "ongoing");
                    game.time--;
                }

            } catch (GameNotFoundException e) {
                gameOngoingMap.remove(game.gameCode);
                sendGameResultMessage(game);
            }
        }
    }

    @Scheduled(fixedRate = 1000)
    private void roundReadyScheduler() {
        List<GameRoomStatus> list = new ArrayList<>(gameReadyMap.values());
        for (GameRoomStatus game : list) {
            if (!gameReadyMap.containsKey(game.gameCode) || game.round < 0) continue;

            if (game.time <= 0) {
                game.time = game.maxTime;
                gameOngoingMap.put(game.gameCode, game);
                gameReadyMap.remove(game.gameCode);

                sendRoundStartMessage(game);
            } else {
                sendTimerMessage(game, "ready");
                game.time--;
            }
        }
    }

    @Scheduled(fixedRate = 1000)
    private void roundEndScheduler() {
        List<GameRoomStatus> list = new ArrayList<>(gameEndMap.values());
        for (GameRoomStatus game : list) {
            if (!gameEndMap.containsKey(game.gameCode) || game.round < 0) continue;

            if (game.time <= 0) {
                game.time = READY_TIME;
                gameReadyMap.put(game.gameCode, game);
                gameEndMap.remove(game.gameCode);

                sendRoundReadyMessage(game);
            } else {
                sendTimerMessage(game, "end");
                game.time--;
            }
        }
    }

    ////////////////////////////플레이어 채팅 입력 관련 컨트롤러/////////////////////////////////////////////////////////
    // 새로운 사용자 입장 메세지
    @MessageMapping("/game/enter")
    public void enterGameUser(@Payload EnterUserMessageDto user) {
        sendMessage(user.getUuid(), new GameResponseDto("enter", user));
    }

    // 퇴장 메세지
    @MessageMapping("/game/leave")
    public void leaveGameUser(@Payload EnterUserMessageDto user) {
        sendMessage(user.getUuid(), new GameResponseDto("leave", user));
    }

    // (플레이어 입력) 플레이어는 채팅 or 정답을 입력한다
    @MessageMapping("/game/chat/send")
    public void sendGameChat(@Payload GameChatRequestDto chatMessage) {
        GameRoomStatus game = gameOngoingMap.get(chatMessage.getGameCode());
        if (game != null && chatMessage.getRound().equals(game.round)) {
            GameAnswerCheck check = gameAnswerService.checkAnswer(chatMessage, game.playerSimilarityMap.keySet());
            switch (check.getType()) {
                case MULTIPLECHOICE:
                case BLANKCHOICE:
                    if (choiceCheck(chatMessage.getContent())) {
                        if (check.getResult()) {
                            setEndGame(game, chatMessage.getUserId());
                        } else {
                            sendMessage(chatMessage.getUuid(), new GameResponseDto("wrongSignal", new GameWorndAnswerResponseDto(chatMessage.getUserId(), chatMessage.getContent())));
                        }
                    }
                    break;
                case BLANKSUBJECTIVE:
                    game.updateSimilarityRanking(chatMessage.getContent(), check.getSimilarity());
                    if (game.similarityGameEnd()) {
                        setEndGame(game, chatMessage.getUserId());
                    } else {
                        sendMessage(chatMessage.getUuid(), new GameResponseDto("similarity", new GameBlankResponseDto(game, "")));
                    }
                    break;
            }
        }

        GameChatResponseDto chat = chatService.insertGameChat(chatMessage);
        sendMessage(chat.getUuid(), new GameResponseDto("chat", chat));
    }

    public void setEndGame(GameRoomStatus game, Long userId) {
        game.time = -game.maxTime;
        sendRoundEndMessage(game, userId);
        setRoundToEnd(game);
    }

    // (게임 시작) 스케쥴러에 게임을 등록하고 준비 메세지 전송
    @PostMapping("/api/v1/game/start")
    public ResponseEntity<?> setGameStart(@RequestBody GameReadyDto ready) {
        if (!gameReadyMap.containsKey(ready.getGameCode())) {
            GameRoomStatus newGame = null;
            try {
                newGame = new GameRoomStatus(ready.getGameCode(), 0, Math.max(gameService.getMaxTimeByGameCode(ready.getGameCode()), 10), 3);

                // 방장일 경우에만 게임 보기가 생성됩니다
                if (gameService.createGameQuiz(ready.getGameCode())) {
                    newGame.round = gameService.updateGameRoundCnt(ready.getGameCode(), true);

                    gameService.updateGameIsStarted(ready.getGameCode(), true);

                    GameQuizDetailResponseDto quiz = gameQuizService.findFirstCurrentDetailGameQuizByGameCode(newGame.gameCode);
                    if (quiz.getType() == BLANKSUBJECTIVE) {
                        newGame.initSimilarity(quiz);
                    }

                    sendRoundReadyMessage(newGame);
                    gameReadyMap.put(ready.getGameCode(), newGame);
                }
            } catch (Exception e) {

                log.debug("Start Error: " + e.getMessage());
                if (newGame != null) {
                    gameReadyMap.remove(newGame.gameCode);
                }
            }

        }
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("start game"));
    }

    @GetMapping("/api/v1/round/quiz/{gameCode}")
    public ResponseEntity<?> getRoundQuiz(@PathVariable String gameCode) {
        GameQuizDetailResponseDto quiz = gameQuizService.findFirstCurrentDetailGameQuizByGameCode(gameCode);
        ResponseData<Object> responseData = ResponseData.success();

        switch (quiz.getType()) {
            case MULTIPLECHOICE, BLANKCHOICE:
                List<GameQuizDetailResponseDto> quizList = gameQuizService.findCurrentDetailGameQuizzesByGameCode(gameCode);
                responseData = ResponseData.success(new RoundQuizResponseDto(quiz.getType(), quizList));
                break;
            case BLANKSUBJECTIVE:
                GameRoomStatus game = gameOngoingMap.get(gameCode);
                GameBlankResponseDto responseDto = new GameBlankResponseDto(game, quiz.getUrl());
                responseData = ResponseData.success(new RoundQuizResponseDto(quiz.getType(), responseDto));
                break;
        }
        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }

    // (게임 시작) 게임 시작 메세지 전송
    @MessageMapping("/api/v1/game/start")
    public void sendGameStartMessage(GameRoomStatus game) {
        sendMessage(game.gameCode, new GameResponseDto("startGame", "start"));
    }

    // (라운드 대기) 라운드 대기 메세지 전송
    public void sendRoundReadyMessage(GameRoomStatus game) {
        GameSystemContentDto responseDto = new GameSystemContentDto(game.round);
        sendMessage(game.gameCode, new GameResponseDto("game", GameSystemResponseDto.ready(responseDto)));
    }

    // (라운드 시작) 라운드 시작 메세지 전송
    public void sendRoundStartMessage(GameRoomStatus game) {
        GameSystemContentDto responseDto = new GameSystemContentDto(game.round);
        sendMessage(game.gameCode, new GameResponseDto("game", GameSystemResponseDto.start(responseDto)));
    }

    // (라운드 종료) 라운드 종료 메세지 전송
    public void sendRoundEndMessage(GameRoomStatus game, Long userId) {
        List<GameUserSimpleResponseDto> list = gameUserService.findSimpleGameUsersByGameCode(game.gameCode);
        List<GameRoundResultResponseDto> response = GameRoundResultResponseDto.build(list, userId);
        GameSystemContentDto responseDto = new GameSystemContentDto(game.round, response);
        sendMessage(game.gameCode, new GameResponseDto("game", GameSystemResponseDto.end(responseDto)));
    }

    // (게임 종료) 게임 종료 메세지 전송
    public void sendGameResultMessage(GameRoomStatus game) {
        List<GameUserSimpleResponseDto> list = gameUserService.findSimpleGameUsersByGameCode(game.gameCode);
        List<GameRoundResultResponseDto> response = GameRoundResultResponseDto.build(list, -1L);
        GameSystemContentDto responseDto = new GameSystemContentDto(response);
        sendMessage(game.gameCode, new GameResponseDto("game", GameSystemResponseDto.result(responseDto)));
    }

    // (타이머) 시간 정보 메세지 전송
    public void sendTimerMessage(GameRoomStatus game, String state) {
        sendMessage(game.gameCode, new GameResponseDto("timer", new GameTimerResponseDto(game.time, game.round, state)));
    }

    // 메세지 기본 템플릿
    public void sendMessage(String uuid, Object data) {
        template.convertAndSend(ENDPOINT + uuid, data);
    }

    // (라운드 종료) 현재 게임 라운드 종료상태로 만들기
    public void setRoundToEnd(GameRoomStatus game) {
        game.round = gameService.updateGameRoundCnt(game.gameCode, false);
        if (game.round < 0) {
            setGameResult(game);
            sendGameResultMessage(game);
        } else {
            GameQuizDetailResponseDto quiz = gameQuizService.findFirstCurrentDetailGameQuizByGameCode(game.gameCode);
            if (quiz.getType() == BLANKSUBJECTIVE) {
                game.initSimilarity(quiz);
            }
        }
    }

    // (게임 종료) 전체 게임 종료 이후 사용자 접수 업데이트
    public void setGameResult(GameRoomStatus game) {
        try {
            gameService.updateUserScore(game.gameCode);
            gameService.resetGame(game.gameCode);
            gameQuizService.deleteGameQuizzesByGameCode(game.gameCode);
        } catch (Exception e) {
            log.debug(e.getMessage());
        }
        gameOngoingMap.remove(game.gameCode);
        gameEndMap.remove(game.gameCode);
        gameReadyMap.remove(game.gameCode);
    }

    public boolean choiceCheck(String data) {
        String pattern = "[1234]";
        Pattern regex = Pattern.compile(pattern);
        Matcher matcher = regex.matcher(data);
        return matcher.matches();
    }
}
