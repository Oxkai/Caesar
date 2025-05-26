import React from 'react';
import WormholeConnect from '@wormhole-foundation/wormhole-connect';

const theme = {
  mode: 'dark',
  primary: '#25D0AB',
  secondary: '#25D0AB',
  font: 'Amina, sans-serif',
};

const Swap = () => {
  return (
    <div className="-mt-24">
      <WormholeConnect theme={theme} />
    </div>
  );
};

export default Swap;
