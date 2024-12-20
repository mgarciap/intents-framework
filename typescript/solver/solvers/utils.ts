import fs from "node:fs";

import { chainMetadata } from "@hyperlane-xyz/registry";
import { MultiProvider } from "@hyperlane-xyz/sdk";
import { ensure0x } from "@hyperlane-xyz/utils";
import { parse } from "yaml";

import { MNEMONIC, PRIVATE_KEY } from "../config.js";
import { NonceKeeperWallet } from "../NonceKeeperWallet.js";

export function getMetadata<TMetadata>(dirname: string): TMetadata {
  const data = fs.readFileSync(`${dirname}/metadata.yaml`, "utf8");
  return parse(data);
}

export function getMultiProvider() {
  if (!PRIVATE_KEY && !MNEMONIC) {
    throw new Error("Either a private key or mnemonic must be provided");
  }

  const multiProvider = new MultiProvider(chainMetadata);
  const wallet = (
    PRIVATE_KEY
      ? new NonceKeeperWallet(ensure0x(PRIVATE_KEY))
      : NonceKeeperWallet.fromMnemonic(MNEMONIC!)
  ) as NonceKeeperWallet;

  multiProvider.setSharedSigner(wallet);

  return multiProvider;
}
