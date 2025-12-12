import "dotenv/config"

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";


const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.7,

})

const jokeprompt = new PromptTemplate({
    template: "Write a funny joke in this: \n{topic}",
    inputVariables: ['topic']
})

const explainJokePrompt = new PromptTemplate({
    template: "Give a summary explaination for this joke:\n {joke}",
    inputVariables: ['joke']
})

const parser = new StringOutputParser()

const chain = RunnableSequence.from([
    jokeprompt.pipe(model).pipe(parser),

    async (joke) => (
        explainJokePrompt.pipe(model).pipe(parser).invoke({ joke })
    )
])


const topic = "skill"

const result = await chain.invoke({ topic })

console.log("RESULT:")
console.log(result)