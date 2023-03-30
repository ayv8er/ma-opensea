import { web3 } from "./web3";
import Greetings from "../build/Greetings.json";

export const greetingsInstance = new web3.eth.Contract(
  Greetings,
  "0x4ce8ca0005798bbfdbb382bcc57f0fcd17c1a0d9"
);
