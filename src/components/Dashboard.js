import { useEffect, useState } from "react";
import { biconomy } from "../libs/biconomy.js";
import { greetingsInstance } from "../libs/greetings.js";

export default function Dashboard({ user }) {
  const [contractNumber, setContractNumber] = useState("");
  const [lastCaller, setLastCaller] = useState("");
  const [numberInput, setNumberInput] = useState();

  const handleNumberSubmit = async (e) => {
    e.preventDefault();
    try {
      const provider = biconomy.provider;
      await biconomy.init();
      setNumberInput("");
      const { data } = await greetingsInstance.populateTransaction.updateNumber(
        Number(numberInput)
      );
      let txParams = {
        data: data,
        to: "0x4ce8ca0005798bbfdbb382bcc57f0fcd17c1a0d9",
        from: user.publicAddress,
        signatureType: "EIP712_SIGN",
      };

      provider.send("eth_sendTransaction", [txParams]).then(() => {
        getNumberFromContract();
        getLastCallerFromContract();
      });
    } catch (err) {
      console.log("handleNumberSubmit Error.");
      console.error(err);
    }
  };

  const getNumberFromContract = async () => {
    const number = await greetingsInstance.getNumber();

    setContractNumber(number.toNumber());
  };

  const getLastCallerFromContract = async () => {
    const lastCaller = await greetingsInstance.getLastCaller();

    setLastCaller(lastCaller);
  };

  useEffect(() => {
    getNumberFromContract();
    getLastCallerFromContract();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Login Credential</h3>
      <p>{user.email ? user.email : user.phoneNumber}</p>
      <h3>Wallet Address</h3>
      <p>{user.publicAddress}</p>

      <h3>Most Recent Caller Address & Lucky Number</h3>
      <p>Current Caller: {lastCaller}</p>
      <p>Current Number: {contractNumber}</p>
      <form onSubmit={handleNumberSubmit} id="number-form">
        <input
          placeholder="What's your lucky number?"
          type="number"
          value={numberInput}
          onChange={(e) => setNumberInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
