# Solana AI Agent Demo

A demonstration of AI-powered Solana transactions using LangChain and Solana Agent Kit. This CLI tool enables natural language interaction with Solana blockchain operations.

## Features
- 🧠 GPT-4 powered agent reasoning
- 💸 Token transfers (SPL and SOL)
- 📊 Balance checking
- 🔍 Transaction history lookup
- 🤖 Interactive chat interface
- 🔧 Automatic wallet generation (testnet only)

## Resources
This project demonstrates AI-agent capabilities using:
- [LangChain's ReAct agent implementation](https://langchain-ai.github.io/langgraph/how-tos/create-react-agent/)
- [LangGraph](https://langchain-ai.github.io/langgraph/) for agent orchestration
- [Solana Agent Kit's](https://github.com/sendaifun/solana-agent-kit) transaction tools
- [OpenAI's API](https://platform.openai.com/docs/overview) for natural language processing

## Prerequisites
- Node.js v18+
- OpenAI API key
- Solana CLI (optional)

## Installation

```bash
bash
git clone [your-repo-url]
cd agents-demo
npm install
```


## Configuration
Create a `.env` file:

```bash
OPENAI_API_KEY=your_openai_key_here
# Optional - only add if using mainnet funds!
SOLANA_PRIVATE_KEY=your_base58_encoded_private_key
```

If no private key is provided:
- A new wallet will be automatically generated
- Generated key is printed to console (testnet only)
- **Never use mainnet funds with auto-generated keys!**

## Usage

```bash
# Start interactive chat
npm run dev
# Example queries:
# "Send 0.1 SOL to Friend's Wallet"
# "What's my USDC balance?"
# "Show my last transaction"
# "Swap 1 SOL for USDC"
```

## Supported Tokens
The agent currently supports these SPL tokens:
- USDC
- USDT
- SOL
- jitoSOL
- bSOL
- mSOL
- BONK
- (Full list in `src/tokenList.ts`)

## Safety Notes
⚠️ Always test with small amounts first  
⚠️ Mainnet transactions are real financial operations  
⚠️ Never commit your `.env` file to version control
