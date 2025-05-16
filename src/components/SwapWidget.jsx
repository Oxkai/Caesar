import React, { useEffect } from 'react';

const SwapWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.mayan.finance/mayan_widget_v_1_2_3.js';
    script.crossOrigin = 'anonymous';
    script.async = true;

    script.onload = () => {
      console.log("✅ MayanSwap script loaded");

      const config = {
        appIdentity: {
          name: 'My Project',
          icon: '/logo.png', // must be in public/
          uri: 'https://myproject.io',
        },
        rpcs: {
          solana: 'https://api.mainnet-beta.solana.com', // working public RPC
        },
      };

      if (window.MayanSwap) {
        console.log("✅ MayanSwap available");
        window.MayanSwap.init('swap_widget', config);
      } else {
        console.error("❌ MayanSwap not found");
      }
    };

    document.body.appendChild(script);

    // Clean up on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Swap Widget</h2>
      <div
        id="swap_widget"
      />
    </div>
  );
};

export default SwapWidget;
