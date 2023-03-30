# Demo - Magic Auth + Biconomy 

[Deployed app](https://ma-opensea.vercel.app/)
- Email OTP and SMS logins available
- SMS login requires `+1` to be prepended to phone number (e.g. +18008675309)
- `Login Credential` and `Wallet Address` provided by Magic SDK
- `Current Caller` and `Current Number` read from deployed Goerli Smart Contract
- Submit a "lucky number" to update number and caller in SC, Biconomy SDK used to subsidize gas fees


# Magic Auth Client SDK

### Intro
- [Magic's Whitepaper](https://magic-whitepaper-key-based-authentication-system.s3.us-west-2.amazonaws.com/Magic+Whitepaper.pdf)
- [Prerequisites](#prerequisites)
### Magic Auth Applications in the Wild
- [Community Gaming](https://www.communitygaming.io/)
- [Niftys](https://niftys.com/)
- [Magic Eden](https://creators.magiceden.io/dashboard)
- [Oddsjam](https://oddsjam.com/)
- [laCollection](https://lacollection.io/)
- [Cryptoys](https://cryptoys.com/)
### Instantiating Magic
- [Constructing Magic Instance](#constructing-magic-instance)
- [Initializing Provider](#initializing-provider)
- [Configuring other Blockchains](#configuring-other-blockchains)
### Authentication
- [Authentication - Email OTP](#authentication---email-otp)
- [Authentication - Phone SMS OTP](#authentication---phone-sms-otp)
- [Authentication - Social Logins](#authentication---social-logins)
### User Module
- [Update Email](#update-email)
- [Update Phone Number](#update-phone-number)
- [Get ID Token](#get-id-token)
- [Get Metadata](#get-metadata)
- [Check if user is currently logged in](#check-if-user-is-currently-logged-in)
- [Logout](#logout)
### Whitelabel Features
- [Custom UI & Email](https://magic.link/docs/auth/more/customization/custom-ui#custom-email-html-template)
- [Custom Email Provider](https://magic.link/docs/auth/more/customization/custom-smtp#configuration)
### Session Management & Security Features
- [Custom Session Management](https://magic.link/docs/auth/more/customization/session-management#overview)
- [Domain Allowlist](https://magic.link/docs/auth/introduction/faq#how-do-i-restrict-which-domains-have-access-to-my-api-key)
- [Multi-factor Authentication](https://magic.link/docs/auth/login-methods/mfa)
- [Security Audits & Compliance](https://magic.link/docs/home/security#security-audits-and-compliance)
- [Magic Admin SDK](#magic-admin-sdk)
### Frequently Asked Questions
- [Errors & Warnings](https://magic.link/docs/auth/api-reference/client-side-sdks/web#errors-warnings)
- [FAQs](#faqs)
-------------

## Prerequisites
1. Create a Magic developer account at https://magic.link/
2. Create a Magic Auth application
3. Retain the application's publishable API key

## Constructing Magic Instance
[Configure and construct your Magic SDK instance](https://magic.link/docs/auth/api-reference/client-side-sdks/web#loginwithemailotp)
- Confirm API key is retrieved from Magic Auth application created in Magic dashboard.
- 'mainnet' or 'goerli' can be passed into the network key to utilize Magic's node infrastructure. These map to 2 unique set of addresses.
- If only API key is passed, Ethereum mainnet will be set by default.
- A custom node configuration can also be passed into the network key. [Example here](https://magic.link/docs/auth/blockchains/ethereum/javascript#configure-custom-nodes)
```javascript
import { Magic } from 'magic-sdk';

const magicClient = new Magic('API_KEY', {
    network: 'mainnet' // Ethereum Mainnet
})
```

## Initializing Provider
[Ethers.js](https://magic.link/docs/auth/blockchains/ethereum/javascript#ethers.js-0)
```javascript
import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';

const magicClient = new Magic('API_KEY');
const provider = new ethers.providers.Web3Provider(magicClient.rpcProvider);
```
[Web3.js](https://magic.link/docs/auth/blockchains/ethereum/javascript#web3.js-0)
```javascript
import { Magic } from 'magic-sdk';
import Web3 from 'web3';

const magicClient = new Magic('API_KEY');
const web3 = new Web3(magicClient.rpcProvider);
```

## Configuring other Blockchains
Magic supports the following blockchains outright and can support all EVM chains. Note some chains require use of a Magic extension NPM package.
- [Algorand](https://magic.link/docs/auth/blockchains/algorand)
- [Arbitrum](https://magic.link/docs/auth/blockchains/arbitrum)
- [Avalanche](https://magic.link/docs/auth/blockchains/avalanche)
- [Binance](https://magic.link/docs/auth/blockchains/binance-smart-chain)
- [Bitcoin](https://magic.link/docs/auth/blockchains/bitcoin)
- [Celo](https://magic.link/docs/auth/blockchains/celo)
- [Cosmos](https://magic.link/docs/auth/blockchains/cosmos)
- [Cronos](https://magic.link/docs/auth/blockchains/cronos)
- [Ethereum](https://magic.link/docs/auth/blockchains/ethereum/javascript)
- [Fantom](https://magic.link/docs/auth/blockchains/fantom)
- [Flow](https://magic.link/docs/auth/blockchains/flow)
- [Harmony](https://magic.link/docs/auth/blockchains/harmony)
- [Hedera](https://magic.link/docs/auth/blockchains/hedera)
- [ICON](https://magic.link/docs/auth/blockchains/icon)
- [Loopring](https://magic.link/docs/auth/blockchains/loopring)
- [Moonbeam](https://magic.link/docs/auth/blockchains/moonbeam)
- [Near](https://magic.link/docs/auth/blockchains/near)
- [Optimism](https://magic.link/docs/auth/blockchains/optimism)
- [Polkadot](https://magic.link/docs/auth/blockchains/polkadot)
- [Polygon](https://magic.link/docs/auth/blockchains/polygon)
- [Solana](https://magic.link/docs/auth/blockchains/solana)
- [Tezos - ConseilJS SDK](https://magic.link/docs/auth/blockchains/tezos/conseiljs)
- [Tezos - Taquito SDK](https://magic.link/docs/auth/blockchains/tezos/taquito)
- [Zilliqa](https://magic.link/docs/auth/blockchains/tezos/taquito)

## Authentication - Email OTP
[loginWithEmailOTP](https://magic.link/docs/auth/api-reference/client-side-sdks/web#loginwithemailotp) method is accessible on the magic instance via the [Auth](https://magic.link/docs/auth/api-reference/client-side-sdks/web#auth-module) Module.
- This promise resolves upon authentication request success to a Decentralized ID token with a default 15-minute lifespan.
- UI customization is possible by passing in `showUI: false`, more information on how to implement this to come.
- You can test this login on 
```javascript
import { Magic } from 'magic-sdk';

const magicClient = new Magic('API_KEY');

try {
  const didToken = await magicClient.auth.loginWithEmailOTP({ 
    email: 'hello@example.com',
    showUI: false, // optional, defaults to true
  });
} catch {
  // Handle errors
}
```

## Authentication - Phone SMS OTP
[loginWithSMS](https://magic.link/docs/auth/api-reference/client-side-sdks/web#loginwithsms) method is accessible on the magic instance via the [Auth](https://magic.link/docs/auth/api-reference/client-side-sdks/web#auth-module) Module.
- This promise resolves upon authentication request success to a Decentralized ID token with a default 15-minute lifespan.
- UI customization is not possible yet but could be setup to accept `showUI: false` to make this happen.
- The phone number must be formatted to E.164 standard.
- Magic currently blocks SMS to certain country codes on the OFAC list or deemed high security risk. [List of blocked country codes](https://magic.link/docs/auth/introduction/faq#questions-around-sms)
- You can test this login on 
```javascript
import { Magic } from 'magic-sdk';

const magicClient = new Magic('API_KEY');

try {
  await magicClient.auth.loginWithSMS({ 
    phoneNumber: '+1-800-867-5309',
  });
} catch {
  // Handle errors
}
```

## Authentication - Social Logins
Social Logins work as an extension to Magic SDK. Steps to install and use the `OAuthExtension` can be found in our [docs](https://magic.link/docs/auth/login-methods/social-logins/integration/oauth-implementation/web#installation) and detailed below.
- [Docs to Google Setup](https://magic.link/docs/auth/login-methods/social-logins/integration/social-providers/google) - [Google Demo](https://8lspb.csb.app/)
- [Docs to Facebook Setup](https://magic.link/docs/auth/login-methods/social-logins/integration/social-providers/facebook) - [Facebook Demo](https://zw5dy.csb.app/)
- [Docs to Twitter Setup](https://magic.link/docs/auth/login-methods/social-logins/integration/social-providers/twitter) - [Twitter Demo](https://4fyz7.csb.app/)
- [Docs to Apple Setup](https://magic.link/docs/auth/login-methods/social-logins/integration/social-providers/apple) - [Apple Demo](https://yg8zi5.csb.app/)
- [Docs to Discord Setup](https://magic.link/docs/auth/login-methods/social-logins/integration/social-providers/discord)
- [Docs to GitHub Setup](https://magic.link/docs/auth/login-methods/social-logins/integration/social-providers/github) - [GitHub Demo](https://e1lzg.csb.app/)
- [Docs to LinkedIn Setup](https://magic.link/docs/auth/login-methods/social-logins/integration/social-providers/linkedin) - [LinkedIn Demo](https://5tg2d.csb.app/)
- [Docs to BitBucket Setup](https://magic.link/docs/auth/login-methods/social-logins/integration/social-providers/bitbucket)
- [Docs to GitLab Setup](https://magic.link/docs/auth/login-methods/social-logins/integration/social-providers/gitlab)
- [Docs to Twitch Setup](https://magic.link/docs/auth/login-methods/social-logins/integration/social-providers/twitch)
- [Docs to Microsoft Setup](https://magic.link/docs/auth/login-methods/social-logins/integration/social-providers/microsoft)
- Note use of `OAuthExtension` from `@magic-ext/oauth`.
```javascript
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

const magicClient = new Magic('YOUR_API_KEY', {
  network: 'mainnet',
  extensions: [new OAuthExtension()],
});
```
- Start the OAuth 2.0 login flow.
```javascript
await magicClient.oauth.loginWithRedirect({
  provider: 'google' // or 'facebook', 'apple', 'github', etc
  redirectURI: 'https://your-app.com/your/oauth/callback',
  scope: ['user:email'], // optional
});
```
- Upon the redirect back to your application, get the final OAuth 2.0 result.
```typescript
const result = await magicClient.oauth.getRedirectResult();

// Result has the following interface
interface OAuthRedirectResult {
  oauth: {
    provider: string;
    scope: string[];
    accessToken: string;
    userHandle: string;

    // `userInfo` contains the OpenID Connect profile information
    // about the user. The schema of this object should match the
    // OpenID spec, except that fields are `camelCased` instead
    // of `snake_cased`.
    // The presence of some fields may differ depending on the
    // specific OAuth provider and the user's own privacy settings.
    // See: https://openid.net/specs/openid-connect-basic-1_0.html#StandardClaims

    userInfo: ...;
  };

  magic: {
    idToken: string;
    userMetadata: MagicUserMetadata;
  };
}
```

## Update Email
[updateEmail](https://magic.link/docs/auth/api-reference/client-side-sdks/we) method is available to call on an email authenticated user via the [User](https://magic.link/docs/auth/api-reference/client-side-sdks/web#user-module) Module.
- This promise resolves upon successful completion of update email flow to a true boolean.
- UI customization is possible by passing in `showUI: false` and [events handling](https://magic.link/docs/auth/api-reference/client-side-sdks/web#events-0).
```javascript
import { Magic } from 'magic-sdk';

const magicClient = new Magic('API_KEY');

try {
  await magicClient.user.updateEmail({ 
    email: 'new_user_email@example.com',
    showUI: false, // optional, defaults to true 
  });
} catch {
  // Handle errors
}
```

## Update Phone Number
[updatePhoneNumber](https://magic.link/docs/auth/api-reference/client-side-sdks/web#updatephonenumber) method is available to call on a phone authenticated user via the [User](https://magic.link/docs/auth/api-reference/client-side-sdks/web#user-module) Module.
- This promise resolves upon successful completion of update phone number flow to a true boolean.
- UI customization is not possible yet but could be setup to accept `showUI: false` along with events to make this happen. 
- However, it is unlikely a user will have access to both phone numbers simultaneously to complete this flow.
- Test behavior in [codesandbox demo](https://codesandbox.io/s/hm7bq6)
```javascript
import { Magic } from 'magic-sdk';

const magicClient = new Magic('API_KEY');

try {
  await magicClient.user.updatePhoneNumber();
} catch {
  // Handle errors
}
```

## Get ID Token
[getIdToken](https://magic.link/docs/auth/api-reference/client-side-sdks/web#getidtoken) method is available to call on an authenticated user via the [User](https://magic.link/docs/auth/api-reference/client-side-sdks/web#user-module) Module.
- This promise resolves to a Decentralized ID token.
- The default lifespan of this token is 900 seconds (15 minutes).
```javascript
import { Magic } from 'magic-sdk';

const magicClient = new Magic('API_KEY');

try {
    const didToken = await magicClient.user.getIdToken({
        lifespan: 3600, // lifespan of token set to 1 hour
    })
} catch {
    // Handle errors
}
```

## Get Metadata
[getMetadata](https://magic.link/docs/auth/api-reference/client-side-sdks/web#getmetadata) method is available to call on an authenticated user via the [User](https://magic.link/docs/auth/api-reference/client-side-sdks/web#user-module) Module.
- This promise resolves to an object containing the issuer (unique user ID), email address, phone number, and cryptographic public address of the authenticated user.
```javascript
import { Magic } from 'magic-sdk';

const magicClient = new Magic('API_KEY');

try {
  const metadata = await magicClient.user.getMetadata();
} catch {
  // Handle errors
}
```

## Check if user is currently logged in
[isLoggedIn](https://magic.link/docs/auth/api-reference/client-side-sdks/web#isloggedin) method is available to call on an authenticated user via the [User](https://magic.link/docs/auth/api-reference/client-side-sdks/web#user-module) Module.
- This promise resolves to a true or false boolean after checking if the user is currently logged in to the Magic SDK.
```javascript
import { Magic } from 'magic-sdk';

const magicClient = new Magic('API_KEY');

try {
  const isUserLoggedIn = await magicClient.user.isLoggedIn();
  console.log(isUserLoggedIn);  // true or false
} catch {
  // Handle errors
}
```

## Logout
[logout](https://magic.link/docs/auth/api-reference/client-side-sdks/web#logout) method is available to call on an authenticated user via the [User](https://magic.link/docs/auth/api-reference/client-side-sdks/web#user-module) Module.
```javascript
import { Magic } from 'magic-sdk';

const magicClient = new Magic('API_KEY');

try {
  await magicClient.user.logout();
  console.log(await magicClient.user.isLoggedIn());  // false
} catch {
  // Handle errors
}
```

## Magic Admin SDK
[NodeJS API Reference](https://magic.link/docs/auth/api-reference/server-side-sdks/node)
- DID tokens resolved from [authentication methods](#authentication) or [getIdToken](#get-id-token) can be used to protect your server.
- Users can be logged out server-side and information you may not want to pass from client to server may be extracted from the DID token in your backend.

## FAQs
- [Can I link email addresses and social logins?](https://magic.link/docs/auth/introduction/faq#can-i-link-email-addresses-and-social-logins)
- [What if a user loses access to their email?](https://magic.link/docs/auth/introduction/faq#what-if-a-user-loses-access-to-their-email) - update, Magic is working on 2nd factor for recovery
- [How can users export their private key?](https://magic.link/docs/auth/introduction/faq#how-can-i-allow-users-to-view-and-export-their-private-key) - You can choose to provide this for your users or not. [Example here](https://reveal.magic.link/niftys)
- [Session vs DID Token?](https://magic.link/docs/auth/introduction/faq#session-vs-did-token)
- [How long does a user remain logged in?](https://magic.link/docs/auth/more/customization/session-management#overview)
- [Can I separate the login and signup flow?](https://magic.link/docs/auth/introduction/faq#can-we-separate-the-login-and-signup)
- [Can I export users from the dashboard?](https://magic.link/docs/auth/more/data-export)
- [Can I delete users from the dashboard?](https://magic.link/docs/auth/introduction/faq#can-i-delete-users-from-the-dashboard) - update, Magic is working on an API for deletion