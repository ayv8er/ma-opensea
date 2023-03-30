import { useEffect, useState } from "react";
import { biconomyProvider } from "../libs/biconomy.js";
import { greetingsInstance } from "../libs/greetings.js";

export default function Dashboard({ user }) {
  const [sendAddress, setSendAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [lastCaller, setLastCaller] = useState("");
  const [numberInput, setNumberInput] = useState("");

  const handleTransactionSubmit = (e) => {
    e.preventDefault();

    /* enter send gasless transaction logic */
  };

  const handleNumberSubmit = async (e) => {
    e.preventDefault();

    /* enter gassless contract method logic */

    // Update number in smart contract
    console.log("greetingsInstance:", greetingsInstance);
    const { data } = await greetingsInstance.populateTransaction.setGreeting(
      numberInput
    );

    let txParams = {
      data: data,
      from: user.publicAddress,
      signatureType: "EIP712_SIGN",
    };

    await biconomyProvider.send("eth_sendTransaction", [txParams]);
  };

  const getNumberFromContract = async () => {
    const number = await greetingsInstance.methods.getNumber().call();

    setContractNumber(number);
    console.log();
  };

  const getLastCallerFromContract = async () => {
    const lastCaller = await greetingsInstance.methods.getLastCaller().call();

    setLastCaller(lastCaller);
  };

  useEffect(() => {
    getNumberFromContract();
    getLastCallerFromContract();
  });

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Email</h3>
      <p>{user.email}</p>
      <h3>MFA Enabled</h3>
      <p>{user.isMfaEnabled ? "Enabled" : "Disabled"}</p>
      <h3>Wallet Address</h3>
      <p>{user.publicAddress}</p>
      <h3>Send Transaction</h3>
      <form onSubmit={handleTransactionSubmit} id="transaction-form">
        <input
          placeholder="Receiving Address"
          value={sendAddress}
          onChange={(e) => setSendAddress(e.target.value)}
        />
        <input
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      <h3>Current Contract Number</h3>
      <p>{contractNumber}</p>
      <form onSubmit={handleNumberSubmit} id="number-form">
        <input
          placeholder="What's your lucky number?"
          value={numberInput}
          onChange={(e) => setNumberInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
