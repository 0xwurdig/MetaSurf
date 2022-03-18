import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

// Ethers.js provider initialization
export const url =
  "https://eth-goerli.alchemyapi.io/v2/nl2PDNZm065-H3wMj2z1_mvGP81bLfqX";
export const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
