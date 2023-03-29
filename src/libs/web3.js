import Web3 from "web3";
import { magic } from "./magic";

export const getWeb3 = () => {
  return new Web3(magic.rpcProvider);
};
