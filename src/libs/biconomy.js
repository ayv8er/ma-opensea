import SmartAccount from "@biconomy/smart-account";
import { ChainId } from "@biconomy/core-types";
import { getWeb3 } from "./web3";

let options = {
  activeNetworkId: ChainId.GOERLI,
  networkConfig: [
    {
      chainId: ChainId.GOERLI,
      dappAPIKey: "DdPv0H_QW.68716b42-c788-48d8-a798-d984b5794cf5"
    }
  ]
};

export const buildBiconomySC = async () => {
  const provider = getWeb3();
  let smartAccount = new SmartAccount(provider, options);
  smartAccount = await smartAccount.init();
  return smartAccount;
};
