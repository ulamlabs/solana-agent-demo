import { PublicKey } from "@solana/web3.js";
import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "solana-agent-kit";

export class SolanaTxTool extends Tool {
  name = "last_tx";
  description = `Get the last transaction of a Solana account.

  If you want to get the last transaction of your wallet, you don't need to provide the address.

  Inputs ( input is a JSON string ):
  address: string, eg "So11111111111111111111111111111111111111112" (optional)`;

  constructor(private solanaKit: SolanaAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const address = input ? new PublicKey(input) : this.solanaKit.wallet_address;
      const txs = await this.solanaKit.connection.getSignaturesForAddress(address, {
        limit: 1,
      });

      const signature = txs[0];
      const txData = await this.solanaKit.connection.getTransaction(signature.signature, {
        maxSupportedTransactionVersion: 0,
      });

      return JSON.stringify({
        status: "success",
        signature,
        txData,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}
