import { createWalletClient, custom } from 'viem';

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Connecting...");
    const walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    try {
      const addresses = await walletClient.requestAddresses();
      console.log(`Metamask connected to address: ${addresses}`);
      connectButton.innerHTML = "Connected!";
    } catch (error) {
      console.log("Connection failed", error);
      connectButton.innerHTML = "Connect";
    }
  } else {
    console.log("Please install MetaMask first!");
  }
}

async function fund(){
    // Ensure wallet is connected and client is initialized
    if (typeof window.ethereum !== "undefined") {
        // Re-initialize or confirm walletClient
        // Note: We assume 'walletClient' is declared globally (e.g., 'let walletClient;')
        walletClient = createWalletClient({
            transport: custom(window.ethereum),
        });
        // Request account access (important step!)
        const [address] = await walletClient.requestAddresses();
        console.log("Wallet connected, Account:", address);
​
        // Now we can proceed with transaction logic...
​
    } else {
        // Handle the case where MetaMask (or other provider) is not installed
        console.log("Please install MetaMask!");
        // Consider disabling the button or updating its text here
        // e.g., fundButton.innerHTML = "Please Install MetaMask";
    }
}

connectButton.addEventListener("click", connect);
