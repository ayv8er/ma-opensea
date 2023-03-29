import { useState } from "react";
import { magic } from "../libs/magic";

export default function Login() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleEmailLogin = async () => {
    try {
      const did = await magic.auth.loginWithEmailOTP({ email });
      console.log(did);
      setEmail("");
    } catch (err) {
      console.log(err);
    }
  };

  const handlePhoneLogin = async () => {
    try {
      const did = await magic.auth.loginWithSMS({ phoneNumber });
      console.log(did);
      setPhoneNumber("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <h1>Magic Auth SDK</h1>
      <div>
        <input
          type="email"
          placeholder="enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleEmailLogin}>Login</button>
      </div>
      <div>
        <input
          type="phone"
          placeholder="enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button onClick={handlePhoneLogin}>Login</button>
      </div>
    </div>
  );
}
