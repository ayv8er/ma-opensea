import { ethers } from "ethers";
import { magic } from "./magic";

export const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
