import { Biconomy } from "@biconomy/mexa";
import { magic } from "./magic";

export const biconomy = new Biconomy(magic.rpcProvider, {
  apiKey: "DdPv0H_QW.68716b42-c788-48d8-a798-d984b5794cf5",
  contractAddresses: ["0x4ce8ca0005798bbfdbb382bcc57f0fcd17c1a0d9"],
});
