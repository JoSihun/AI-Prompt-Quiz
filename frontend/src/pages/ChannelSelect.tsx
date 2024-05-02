import React, { useEffect, useState } from 'react';
import ChannelBox from '../components/channel/ChannelBox';
import { ChannelApi } from '../hooks/axois-channel';
// import ChannelBox from '../components/channel/ChannelBox';

const ChannelSelectPage = () => {
  const [channelArray, setChannelList] = useState<Channel[]>([]);
  useEffect(() => {
    // 채널리트스 가져오기
    const response = ChannelApi.getChannelList()
      .then((response) => {
        setChannelList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const headerStyle = {
    width: '100%',
    height: '50px',
    color: '#359DB0',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    opacity: '0.7',
    fontSize: '20px',
  };
  const channelList = {
    width: '100%',
    height: '400px',
    color: '#359DB0',
    display: 'flex',
    flexFlow: 'row wrap',
    // justifyContent: 'center',
    backgroundColor: 'white',
    opacity: '0.7',
    marginTop: '10px',
  };
  return (
    <div
      className="w-fit p-2 m-4"
      style={{
        // backgroundColor: 'yellow',
        width: '80%',
        height: '80%',
      }}
    >
      <div
        className="container"
        style={{
          width: '80%',
          height: '80%',
          //   display: 'flex',
          //   justifyContent: 'center',
        }}
      >
        <div style={headerStyle}>채널목록</div>
        <div style={channelList}>
          {/* <ChannelBox id={1} code="code1" name="채널1" curPlayers={10} maxPlayers={100} /> */}
          {channelArray.map((item, idx) => (
            <ChannelBox
              id={item.id}
              code={item.code}
              name={item.name}
              curPlayers={item.curPlayers}
              maxPlayers={item.maxPlayers}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelSelectPage;
