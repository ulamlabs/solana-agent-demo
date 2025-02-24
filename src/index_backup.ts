// Langchain
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

// Solana Agent Kit
import { SolanaAgentKit } from "solana-agent-kit";
import {
    SolanaTransferTool,
    SolanaTradeTool,
    SolanaGetWalletAddressTool,
    SolanaBalanceOtherTool
} from "solana-agent-kit/dist/langchain";
import { SolanaTxTool } from "./txTool";

// Other
import dotenv from "dotenv";

// Utils
import { printAgentResponse } from "./formatResponse";
import { tokenList } from "./tokenList";
import { getPrivateKey } from "./getPrivateKey";
dotenv.config();

const privateKey = getPrivateKey();

// Initialize Solana Agent Kit
const solanaAgentKit = new SolanaAgentKit(
    privateKey,
    "https://api.mainnet-beta.solana.com",
    {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    }
);

const solanaTools = [
    new SolanaBalanceOtherTool(solanaAgentKit),
    new SolanaTransferTool(solanaAgentKit),
    new SolanaTradeTool(solanaAgentKit),
    new SolanaGetWalletAddressTool(solanaAgentKit),
    new SolanaTxTool(solanaAgentKit),
];

// Initialize Langchain Agent
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

// Function to talk to the agent
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

// Function to interact with the agent
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

interactiveChat();
