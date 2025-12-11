// SIMPLE CHAINING

// Prompt → Model → Next Prompt → Model → Output


import "dotenv/config";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables";


const model1 = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
})

const summaryPrompt = new PromptTemplate({
    template: "Summarize the following text:\n{text}",
    inputVariables: ['text']
})

const questionPrompt = new PromptTemplate({
    template: "Create Five MCQ question based on this summary:\n{summary} and don't give the answer",
    inputVariables: ["summary"]
})


const parser = new StringOutputParser();


//Chaining
const chain = RunnableSequence.from([
    summaryPrompt.pipe(model1).pipe(parser),

    async (summary) => (
        questionPrompt.pipe(model1).pipe(parser).invoke({ summary })
    )
])


const inputText = `
Support Vector Machines are supervised learning models used for classification and regression.
`;


const result = await chain.invoke({ text: inputText });

console.log("FINAL RESULT:");
console.log(result);