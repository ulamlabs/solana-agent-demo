import { SolanaAgentKit } from "solana-agent-kit";
import {
    SolanaBalanceTool,
    SolanaTransferTool,
    SolanaTradeTool,
    SolanaGetWalletAddressTool,
    SolanaBalanceOtherTool
} from "solana-agent-kit/dist/langchain";
import { SolanaTxTool } from "./txTool";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import bs58 from "bs58";
import { Keypair } from '@solana/web3.js';

import { printAgentResponse } from "./formatResponse";
import { tokenList } from "./tokenList";

dotenv.config();

// Generate a new keypair
const keypair = Keypair.generate();

// Get the private key as a base58 encoded string
const privateKeyString = bs58.encode(keypair.secretKey);

const solanaAgentKit = new SolanaAgentKit(
    privateKeyString,
    "https://api.mainnet-beta.solana.com",
    {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    }
);

const solanaTools = [
    new SolanaBalanceTool(solanaAgentKit),
    new SolanaBalanceOtherTool(solanaAgentKit),
    new SolanaTransferTool(solanaAgentKit),
    new SolanaTradeTool(solanaAgentKit),
    new SolanaGetWalletAddressTool(solanaAgentKit),
    new SolanaTxTool(solanaAgentKit),
];

const agent = createReactAgent({
    llm: new ChatOpenAI({
        model: "gpt-4o-mini",
    }),
    tools: solanaTools,
    prompt: `
    You are a helpful assistant that can help with Solana transactions and balances.
    Tokens you can help with are: ${tokenList.map(token => `${token.ticker} (${token.mintAddress})`).join(", ")}
    `
});

async function talkToAgent(question: string) {
    const stream = await agent.stream({
        messages: [
            new HumanMessage(question),
        ],
    });

    for await (const chunk of stream) {
        printAgentResponse(chunk);
    }
}

async function interactiveChat() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const askQuestion = () => {
        readline.question('\nEnter your question (or type "exit" to quit): ', async (question: string) => {
            if (question.toLowerCase() === 'exit') {
                console.log('Goodbye!');
                readline.close();
                process.exit(0);
            } else {
                await talkToAgent(question);
                askQuestion(); // Ask for next question
            }
        });
    };

    askQuestion(); // Start the first question
}

// Replace the direct call to talkToAgent with the interactive chat
interactiveChat();
