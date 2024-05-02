import React, { useEffect, useState } from 'react';

const GamePlayer = () => {
  return (
    <div
      className="h-4 rounded-full w-full bg-white mb-1 border-extralightmint
             border relative overflow-hidden flex"
    >
      <div
        className="w-full h-full rounded-full -translate-x-[0%] transition-transform
               duration-1000 bg-mint absolute"
      ></div>
    </div>
  );
};

export default GamePlayer;
