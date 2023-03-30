import { ethers } from "ethers";
import { biconomy } from "./biconomy";
import Greetings from "../build/Greetings.json";

export const greetingsInstance = new ethers.Contract(
  "0x4ce8ca0005798bbfdbb382bcc57f0fcd17c1a0d9",
  Greetings,
  biconomy.ethersProvider
);
