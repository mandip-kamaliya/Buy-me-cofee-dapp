import { createWalletClient, custom ,createPublicClient,defineChain,parseEther,formatEther} from 'https://esm.sh/viem';
import { contractAddress, abi } from './constants.js';

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
     const ethAmount = ethAmountInput.value;
    console.log(`Funding with ${ethAmount}...`);
    // Ensure wallet is connected and client is initialized
    if (typeof window.ethereum !== "undefined") {
        // Re-initialize or confirm walletClient
        // Note: We assume 'walletClient' is declared globally (e.g., 'let walletClient;')
       const walletClient = createWalletClient({
            transport: custom(window.ethereum),
        });
        const publicClient=createPublicClient({
            transport: custom(window.ethereum)
        })
        // Request account access (important step!)
        const [address] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);
       const {request} = await publicClient.simulateContract({
        address: contractAddress, // TODO: Add deployed contract address
        abi: abi,     // TODO: Add contract ABI
        functionName: 'fund',
        chain:currentChain,
        account: address,   // Use the address obtained from requestAddresses
        value: parseEther(ethAmount),
        blockTag: 'latest'   // TODO: Add parsed ETH amount in Wei
        })
        const hash = await walletClient.writeContract(request)
        console.log("Transaction processed: ", hash)      // Now we can proceed with transaction logic...
    } else {
        // Handle the case where MetaMask (or other provider) is not installed
        console.log("Please install MetaMask!");
        // Consider disabling the button or updating its text here
        // e.g., fundButton.innerHTML = "Please Install MetaMask";
    }
}
async function getCurrentChain(client){
    const chainId = await client.getChainId();
    const currentChain = defineChain({
    id: chainId,
    name: "Local Devnet", // Provide a descriptive name (e.g., Anvil, Hardhat)
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
 rpcUrls: {
      // Use the RPC URL of your local node
      default: { http: ["http://localhost:8545"] },
      // public: { http: ["http://localhost:8545"] }, // Optional: specify public RPC if different
    },
    // Add other chain-specific details if needed (e.g., blockExplorers)
  });
  return currentChain;
}

async function GetBalance() {
  if(typeof(window.ethereum) !== "undefined"){
   try {
     const publicClient =  createPublicClient({
       transport:custom(window.ethereum)
     });
     const Balance = await publicClient.getBalance({
        address:contractAddress
     })
     console.log(formatEther(Balance))
   } catch (error) {
    console.log(error);    
}
  }else{
    alert("Please Connect to metamask!!!!");
  }
}


connectButton.addEventListener("click", connect);
fundButton.addEventListener("click",fund);
balanceButton.addEventListener("click",GetBalance)