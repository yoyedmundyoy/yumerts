import {encodeFunctionData, erc20Abi} from 'viem';

interface Wallet {
  address: Address;
  // Add other wallet properties you're using
}


export const payUSDC = async (
  wallets: Wallet[], 
  amountToDeposit: bigint | number
) => {

    let current_wallet = wallets[0];
    current_wallet.switchChain(421614);
    const provider = await current_wallet.getEthersProvider();
    const signer = provider.getSigner();
  
    const USDC_TOKEN_ADDRESS = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
    const CONTRACT_TOKEN_ADDRESS = "0xefb612f067c166f77974f5bb0b04616730c0b483"
  
    const USDC_TOKEN_APPROVE_ABI = erc20Abi;
    const DEPOSIT_ABI = [{"inputs":[{"internalType":"uint64","name":"amount","type":"uint64"}],"name":"depositUsdc","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getUsdcBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"setMyAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"transferUsdcToOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"viewMyAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
  
    const USDC_FUNCTION_DATA = encodeFunctionData({
      abi: USDC_TOKEN_APPROVE_ABI, 
      functionName: "approve",
      args: [CONTRACT_TOKEN_ADDRESS, BigInt(amountToDeposit)]
    });
    const USDC_APPROVAL_REQUEST = {
      to: USDC_TOKEN_ADDRESS,
      data: USDC_FUNCTION_DATA
    }
  
    signer.sendTransaction(USDC_APPROVAL_REQUEST);
  
    const DEPOSIT_FUNCTION_DATA = encodeFunctionData({
      abi: DEPOSIT_ABI,
      functionName: "depositUsdc",
      args: [BigInt(amountToDeposit)]
    })
  
    const DEPOSIT_REQUEST = {
      to: CONTRACT_TOKEN_ADDRESS,
      data: DEPOSIT_FUNCTION_DATA
    }
  
    signer.sendTransaction(DEPOSIT_REQUEST);

    return;
  }