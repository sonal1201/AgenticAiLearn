import express from "express";
import dotenv from "dotenv";
import { z } from "zod";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json());

//model
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash",
  maxOutputTokens: 2048,
  temperature: 0.8,
  apiKey: process.env.GOOGLE_API_KEY,
});

///tools: MenuTool
const getMenuTool = new DynamicStructuredTool({
  name: "getMenuTool",
  description:
    "Return the final answer for today's menu for the given category (breakfast, lunch, evening snack or dinner). Use this tool to directly answer the User menu question.",
  schema: z.object({
    category: z
      .string()
      .describe(
        "type of food. Example: breakfast, lunch, evening snack, dinner"
      ),
  }),

  func: async ({ category }) => {
    const menus = {
      breakfast: "Aloo paratha, poha, Masala Chai",
      lunch: "Sahi Paneer, Veg Biryani, Dal Fry, Jeera Rice, Roti, raita",
      evening_snacks: "Coffee, tea, somosha, aloo patty",
      dinner: "Roti, rajma, aloo gobi, ice-creams, salad",
    };
    return (
      menus[category.toLowerCase()] ||
      "no menu found for this category, lease include breakfast or lunch or snacks or dinner in the input"
    );
  },
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that use tool when needed."],
  ["human", "{input}"],
  ["ai", "{agent_notebook}"],
]);

const agent = await createToolCallingAgent({
  llm: model,
  tools: [getMenuTool],
  prompt,
});

const excutor = await AgentExecutor.fromAgentAndTools({
  agent,
  tools: [getMenuTool],
});

app.get("/", (req, res) => {
  res.json({
    message: "sever is listining",
  });
});

app.listen(PORT, () => {
  console.log("server is running: 3000");
});
