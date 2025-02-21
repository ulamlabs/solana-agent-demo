
import bs58 from "bs58";
import { Keypair } from '@solana/web3.js';


export function getPrivateKey() {
    if (!process.env.SOLANA_PRIVATE_KEY) {
        // Generate a new keypair
        const keypair = Keypair.generate();

        // Get the private key as a base58 encoded string
        const privateKeyString = bs58.encode(keypair.secretKey);

        return privateKeyString;
    }

    return process.env.SOLANA_PRIVATE_KEY;
}
