import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

// Create the context
const WalletContext = createContext(null);

// Custom hook for easy context usage
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

// Wallet Provider component
export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState(null);

  // Function to connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signerInstance = await provider.getSigner();
        setSigner(signerInstance);

        console.log("Wallet connected:", accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask!");
    }
  };

  // Function to check if already connected on page load
  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signerInstance = await provider.getSigner();
        setSigner(signerInstance);

        console.log("Wallet already connected:", accounts[0]);
      }
    }
  };

  // Auto-check wallet on mount
  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ walletAddress, signer, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
