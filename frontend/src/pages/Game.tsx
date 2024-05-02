import React, { useEffect, useRef, useState } from 'react';
import { IoSettings } from 'react-icons/io5';
import { IoLogOut } from 'react-icons/io5';
import { FaUserPlus } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import GamePlayer from '../components/game/Player';
import SelectionGame from '../components/game/SelectionGame';
import GameChat from '../components/game/GameChat';
import GameRoomSetting from '../components/game/GameRoomSetting';
import GameApi from '../hooks/axios-game';
import { useLoaderData } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client, Message, IMessage } from '@stomp/stompjs';
import { useWebSocketStore } from '../stores/socketStore';
import useUserStore from '../stores/userStore';

const GamePage = () => {
  const [gamestart, setGamestart] = useState(false);
  const [earthquake, setEarthquake] = useState(false);
  const [game, setGame] = useState<Game | null>(null);
  const { roomId } = useParams();
  const [chat, setChat] = useState<GameChatRecieve[]>([]);
  const client = useRef<Client | null>(null);
  const { user } = useUserStore();
  const { connectWebSocket, disconnectWebSocket, publish } = useWebSocketStore();
  const chattingBox = useRef(null);
  const chatInput = useRef(null);
  const chatBtn = useRef(null);
  const [chatOpen, setChatOpen] = useState(false);

  const getGameData = async () => {
    const response = await GameApi.getGame(roomId);
    setGame(response.data);
    console.log(game);
    // enterGame();
  };

  useEffect(() => {
    getGameData();
    // 채팅 입력 바깥 클릭 시 채팅창 닫기
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (target && !chatInput.current?.contains(target) && !chatBtn.current?.contains(target)) {
        chatFocusOut();
      }
    };

    // 채팅 입력 안하고 있을 때 Enter시 채팅창 열기
    const handleChatKey = (event: KeyboardEvent) => {
      const target = event.target as Node;
      if (event.key === 'Enter' && !chatInput.current?.contains(target) && !chatOpen) {
        chatFocus();
      }
    };

    // 클릭 & 키다운 이벤트 추가
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleChatKey);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    // 게임 로드하면 구독.
    connectWebSocket(`/ws/sub/game?uuid=${game?.code}`, recieveChat, enterGame);
    return () => {
      disconnectWebSocket();
    };
  }, [game]);

  // 채팅창 열기
  const chatFocus = () => {
    chatInput.current.focus();
    setChatOpen(true);
  };

  // 채팅창 닫기
  const chatFocusOut = () => {
    chatInput.current.blur();
    setChatOpen(false);
  };

  const recieveChat = (message: IMessage) => {
    if (message.body) {
      const body: RecieveData = JSON.parse(message.body);
      gameController(body);
    }
  };

  const gameController = (data: RecieveData) => {
    if (data.tag === 'chat') {
      // console.log(body.data);
      setChat((prevItems) => [...prevItems, data.data]);
      // setChat((prevItems) => [...prevItems, body]);
    } else if (data.tag === 'enter') {
      // console.log(body.data);
      // const data: GameChatRecieve = {
      //   userId: -1,
      //   nickname: 'system',
      //   uuid: game.code,
      //   gameId: game.id,
      //   round: 0,
      //   content: `${body.data.nickname}님이 입장하셨습니다.`,
      //   createdDate: '',
      // };
      // setChat((prevItems) => [...prevItems, data]);
    } else if (data.tag === 'leave') {
    } else if (data.tag === 'timer') {
    } else if (data.tag === 'wrongSignal') {
    } else if (data.tag === 'similarity') {
    } else if (data.tag === 'game') {
    }
  };
  const enterGame = () => {
    const gameEnter: GameEnter = {
      userId: user.userId,
      uuid: game?.code,
      nickname: user.nickName,
    };
    const destination = '/ws/pub/game/enter';
    publish(destination, gameEnter);
  };

  const publishChat = () => {
    const destination = '/ws/pub/game/chat/send';
    const gameChat: GameChat = {
      userId: user.userId,
      nickname: user.nickName,
      uuid: game.code,
      gameId: game.id,
      round: 0,
      content: chatInput.current.value,
    };
    publish(destination, gameChat);
    chatInput.current.value = '';
  };

  // const chatFunction = () => {
  //   const chatChild = document.createElement('div');
  //   chatChild.className = 'flex';
  //   const chatUser = document.createElement('p');
  //   const chatMessage = document.createElement('p');
  //   chatUser.className = 'font-extrabold pr-1 text-nowrap text-black';
  //   chatUser.innerText = '푸바오 ㅠㅠㅠ : ';
  //   chatMessage.innerText = chatInput.current.value;
  //   chatChild.appendChild(chatUser);
  //   chatChild.appendChild(chatMessage);
  //   chatInput.current.value = '';
  //   chattingBox.current.appendChild(chatChild);
  // };

  // 버튼 제어
  // [0]초대하기 | [1]나가기 | [2]1팀 | [3]2팀 | [4]랜덤 | [5]게임시작
  const [activateBtn, setActivateBtn] = useState<ActivateButton>({});
  const [isStart, setIsStart] = useState<boolean>(false);
  const [btnCurrentActivate, setBtnCurrentActivate] = useState<boolean>(false);
  const handleClick = (id: number) => {
    // 버튼 비활성화 상태라면 이벤트 방지
    setIsStart((disable) => {
      if (!disable || id === 1) {
        // 버튼이 활성돼있는 동안 버튼 클릭 방지
        setBtnCurrentActivate((current) => {
          if (!current) {
            setBtnCurrentActivate(true);
            setActivateBtn((prev) => ({ ...prev, [id]: true }));
            setTimeout(() => {
              // 게임 시작 시 버튼 비활성화
              if (id === 5) {
                console.log('start!!!');
                handleGamestart();
                setIsStart(true);
              }
              // 버튼 이벤트 활성화
              setActivateBtn((prev) => ({ ...prev, [id]: false }));
              setTimeout(() => {
                setBtnCurrentActivate(false);
              }, 300);
            }, 400);
            return true;
          }
          return current;
        });
      }
      return disable;
    });
  };

  // 게임 시작 이벤트
  const handleGamestart = () => {
    setGamestart(true);
    setTimeout(() => {
      setEarthquake(true);
      setTimeout(() => {
        setEarthquake(false);
        setTimeout(() => {
          setGamestart(false);
        }, 1000);
      }, 600);
    }, 500);
  };

  return (
    <div
      className={`bg-white/80 w-[75vw] h-[90vh] min-w-[50rem] min-h-[40rem] z-10 
      rounded-3xl drop-shadow-lg px-8 py-6 flex flex-col items-center justify-center 
      ${earthquake ? 'animate-earthquake' : ''}`}
    >
      <div
        className={`absolute bg-no-repeat bg-contain bg-center bg-[url(/public/ui/gamestart.png)] 
        w-full h-full flex items-center justify-center text-white text-6xl z-20 font-extrabold 
        transition ease-in duration-500 ${gamestart ? 'block translate-y-0' : 'translate-y-[-100vh]'}`}
      ></div>
      {/* 상단 : 제목, 버튼 */}
      <div className="w-full h-10 flex gap-4 mb-2">
        {/* 채널 */}
        <label className="flex items-center w-1/3 py-4 border-custom-mint bg-white text-sm">
          <p className="text-center w-full text-nowrap">{game?.channelId}채널</p>
        </label>
        {/* 제목 */}
        <label className="flex items-center w-full grow py-4 border-custom-mint bg-white text-sm">
          <div className="border-r border-gray-200 pl-3 pr-2.5">{roomId}</div>
          <p className="text-center w-full text-nowrap line-clamp-1">{game?.title}</p>
        </label>
        {/* 버튼 */}
        <div className="w-1/3 flex gap-4">
          <button
            className={`
            transition text-sm w-1/2 text-white ${activateBtn[0] ? 'animate-clickbtn scale-105' : ''}
            ${
              isStart
                ? 'border-custom-gray bg-[#999999] cursor-default'
                : 'btn-mint-border-white hover:brightness-125 hover:scale-110 cursor-pointer'
            }
            `}
            onClick={() => {
              handleClick(0);
            }}
          >
            <label
              className={`
            flex gap-1 items-center px-2 overflow-hidden max-xl:justify-center font-extrabold
            ${isStart ? 'cursor-default' : 'cursor-pointer'}
            `}
            >
              <FaUserPlus className="min-w-5 min-h-5 mb-0.5" />
              <p
                className="text-center w-full text-nowrap text-sm overflow-hidden 
              text-ellipsis xl:flex max-xl:hidden"
              >
                초대하기
              </p>
            </label>
          </button>
          <button
            className={`btn-red text-white hover:brightness-125 hover:scale-105 transition 
            text-sm w-1/2 min-w-[3rem] ${activateBtn[1] ? 'animate-clickbtn scale-105' : ''}`}
            onClick={() => {
              handleClick(1);
            }}
          >
            <label className="flex gap-1 items-center px-2 cursor-pointer overflow-hidden max-xl:justify-center">
              <IoLogOut className="min-w-6 min-h-6 mb-0.5" />
              <p className="text-center w-full text-nowrap text-sm overflow-hidden text-ellipsis xl:flex max-xl:hidden">
                나가기
              </p>
            </label>
          </button>
        </div>
      </div>
      {/* 중간 : 플레이어, 문제 화면 */}
      <div className="w-full h-[22rem] flex flex-col items-center mb-4">
        <div className="w-full h-full flex gap-4 pt-5">
          {/* 좌파 */}
          <div className="w-1/3 flex flex-col gap-3">
            {Array.from({ length: 6 }, (_, index) => (
              <GamePlayer key={index} idx={index + 1} />
            ))}
          </div>
          {/* 문제 화면, 타이머 */}
          <div className="w-full grow flex flex-col">
            <div className="border-custom-mint w-full h-full flex items-center justify-center relative">
              <div
                className="w-16 h-7 absolute top-2 left-2 bg-yellow-500/80 text-white
               rounded-full flex items-center justify-center font-extrabold text-xs border border-gray-300"
              >
                1/20
              </div>
              <div
                className="w-full h-full bg-[url(/public/testphoto.png)] 
              bg-cover bg-center"
              ></div>
            </div>
          </div>
          {/* 우파 */}
          <div className="w-1/3 flex flex-col gap-3">
            {Array.from({ length: 6 }, (_, index) => (
              <GamePlayer key={index} idx={index + 7} />
            ))}
          </div>
        </div>
      </div>
      {/* 광고, 채팅창, 게임 설정 */}
      <div className="w-full h-48 flex gap-4">
        {/* 광고 */}
        <div className="w-1/3 bg-red-200 flex justify-center items-center">광고</div>
        {/* 채팅창, 객관식 선택, 순서 배치 등 */}
        <div className="w-full flex grow flex-col items-center justify-end">
          <div className="w-full h-36 mb-2 relative">
            {/* 객관식 선택 */}
            <SelectionGame />
          </div>
          {/* 채팅 */}
          <div className="w-full">
            <div className="relative w-full">
              <div
                className={`absolute flex items-center w-full h-36 bottom-0 mb-2 transition-all origin-bottom duration-300 ${chatOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
              >
                <div className="absolute w-full h-[90%] px-3 py-2 text-sm chat z-10">
                  <div className="z-10 text-gray-700" ref={chattingBox}>
                    {chat.map((chatItem, index) => (
                      <div className="flex" key={index}>
                        <p className="font-extrabold pr-1 text-nowrap text-black">
                          {chatItem.nickname}
                        </p>
                        <p>{chatItem.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute w-full h-full border-custom-white opacity-90 bg-white z-0"></div>
              </div>
            </div>

            <div className="w-full h-10 bg-white/80 rounded-full flex relative">
              <input
                ref={chatInput}
                className="w-full h-10 bg-transparent rounded-full pl-5 pr-20 text-sm placeholder-gray-400"
                maxLength={30}
                placeholder={`${chatOpen ? 'Esc를 눌러 채팅창 닫기' : 'Enter를 눌러 채팅 입력'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (chatInput.current.value !== '') {
                      publishChat();
                    }
                  } else if (e.key === 'Escape') chatFocusOut();
                }}
                onClick={chatFocus}
              ></input>
              <div
                className="w-16 bg-mint cursor-pointer absolute h-full right-0 rounded-r-full flex justify-center items-center hover:brightness-125 transition"
                ref={chatBtn}
                onClick={() => {
                  if (chatInput.current.value !== '') {
                    publishChat();
                    if (!chatOpen) chatFocus();
                  }
                }}
              >
                <IoSend className="text-white w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
        {/* 게임 설정 */}
        <div className="w-1/3 flex flex-col cursor-default">
          {/* 방 설정 */}
          <GameRoomSetting gamestart={isStart} />

          {/* 팀 선택, 게임 시작 버튼 */}
          <div className="w-full h-7 my-2 flex gap-2">
            <button
              className={`w-1/3 h-full flex items-center justify-center text-white text-sm font-bold transition 
              ${activateBtn[2] ? 'animate-clickbtn scale-105' : ''}
              ${
                isStart
                  ? 'border-custom-gray bg-[#999999] cursor-default'
                  : 'border-custom-red bg-customRed hover:brightness-125 hover:scale-110 cursor-pointer'
              }
              `}
              onClick={() => {
                handleClick(2);
              }}
            >
              1팀
            </button>
            <button
              className={`w-1/3 h-full flex items-center justify-center
              text-white text-sm font-bold transition 
              ${activateBtn[3] ? 'animate-clickbtn scale-105' : ''}
              ${
                isStart
                  ? 'border-custom-gray bg-[#999999] cursor-default'
                  : 'border-custom-blue bg-customBlue hover:brightness-125 hover:scale-110 cursor-pointer'
              }
              `}
              onClick={() => {
                handleClick(3);
              }}
            >
              2팀
            </button>
            <button
              className={`w-1/3 h-full flex items-center justify-center text-white text-sm font-bold transition
              ${activateBtn[4] ? 'animate-clickbtn scale-105' : ''}
              ${
                isStart
                  ? 'border-custom-gray bg-[#999999] cursor-default'
                  : 'border-custom-green bg-customGreen hover:brightness-125 hover:scale-110 cursor-pointer'
              }
              `}
              onClick={() => {
                handleClick(4);
              }}
            >
              랜덤
            </button>
          </div>
          <button
            className={`w-full h-8 font-extrabold
             transition mb-1 ${activateBtn[5] ? 'animate-clickbtn scale-105' : ''}
             ${
               isStart
                 ? 'border-custom-gray bg-[#999999] cursor-default text-white'
                 : ' btn-mint-border-white hover:brightness-125 hover:scale-110 cursor-pointer'
             }
             `}
            onClick={() => {
              handleClick(5);
            }}
          >
            게임시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
