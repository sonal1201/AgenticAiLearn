// Step1(input) → Step2(output from Step1) → Step3(output from Step2)

//            ┌──────────┐
// Input ──>  │  Step 1  │
//            └────┬─────┘
//                 ▼
//            ┌──────────┐
//            │  Step 2  │
//            └────┬─────┘
//                 ▼
//            ┌──────────┐
//            │  Step 3  │
//            └────┬─────┘
//                 ▼
//               Output

import "dotenv/config"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
})

const summaryPrompt = new PromptTemplate({
    template: "Summarize this text:\n{text}",
    inputVariables: ['text']
})

const mcqPrompt = new PromptTemplate({
    template: "Create 3 MCQs based on this summary:\n{summary},",
    inputVariables: ['summary']
})


const guidePrompt = new PromptTemplate({
    template: "Combine this summary and MCQs (without answer) into a final study guide.\n\nSummary:\n{summary}\n\nMCQs:\n{mcqs}",
    inputVariables: ['summary', 'mcqs']
})


const parser = new StringOutputParser();

const chain = RunnableSequence.from([
    summaryPrompt.pipe(model).pipe(parser),

    async (summary) => {
        const mcqs = mcqPrompt.pipe(model).pipe(parser).invoke({ summary })
        return { summary, mcqs };
    },

    async ({ summary, mcqs }) => {
        return guidePrompt.pipe(model).pipe(parser).invoke({ summary, mcqs })
    }
])

const text = `
Support Vector Machines are supervised learning models used for classification and regression.
`;

const result = await chain.invoke({ text })

console.log("FINAL OUTPUT:");
console.log(result);