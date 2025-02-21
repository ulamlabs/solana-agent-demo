import { AIMessage, ToolMessage } from "@langchain/core/messages";

type AgentResponse = {
    agent?: {
        messages: AIMessage[];
    }
    tools?: {
        messages: ToolMessage[];
    }
};

export function printAgentResponse(response: AgentResponse) {
  if (response.agent) {
    for (const message of response.agent.messages) {
        if (message.content) {
            const content = message.content;
            console.log(`🤖 Agent: \x1b[32m${content}\x1b[0m`);
        }
        if (message.tool_calls) {
            for (const toolCall of message.tool_calls) {
                console.log(`> 🤖 Agent: Calling tool \x1b[33m${toolCall.name}\x1b[0m`, toolCall.args);
            }
        }
    }
  } else if (response.tools) {
    for (const tool of response.tools.messages) {
      console.log(`> 🛠️ Tool \x1b[33m${tool.name}\x1b[0m: \x1b[32m${tool.content}\x1b[0m`);
    }
  }
}
