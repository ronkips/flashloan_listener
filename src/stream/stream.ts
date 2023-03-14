import { BigNumber, ethers, utils } from "ethers";
import dotenv from "dotenv";
import { notification } from "../telegram/telegram";
import ABI from "../../contract-abi.json";
export const ListeningEvents = async () => {
  const USDCAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const FlashLoanProviderAddress = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640";
  const provider = new ethers.providers.WebSocketProvider(process.env.WSS_URL!);
  const USDCContract = new ethers.Contract(USDCAddress, ABI, provider);

  const filterFrom = USDCContract.filters.Transfer(FlashLoanProviderAddress);

  USDCContract.on(filterFrom, async (from, to, value, event) => {
    const myEvent = await provider.getTransaction(event.transactionHash);
      const myValue = ethers.utils.formatEther(myEvent.value);
      console.log("Your data is:", to, myValue, event.transactionHash);
  
    if (Number(myValue) >= 10 ) {
      const message = `Your data is :\n\n to: https://etherscan.io/address/${to} \n\n value: ${myValue} ETH \n\n  TransactionHash: https://etherscan.io/tx/${event.transactionHash}`;
      await notification(message);
    }

  });
};
