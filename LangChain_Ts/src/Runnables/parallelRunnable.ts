import "dotenv/config"

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableParallel } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.3
})

const tweetPrompt = new PromptTemplate({
    template: "Generate only one tweet about: \n {topic}",
    inputVariables: ['topic']
})

const linkdinPrompt = new PromptTemplate({
    template: "Generate only one Linkdin post about: \n {topic}",
    inputVariables: ['topic']
})

const parser = new StringOutputParser()

const tweetChain = tweetPrompt.pipe(model).pipe(parser)
const linkdinChain = linkdinPrompt.pipe(model).pipe(parser)

const parallelChain = RunnableParallel.from({
    tweet: tweetChain,
    linkdin: linkdinChain,
})

const result = await parallelChain.invoke({ topic: "LangChain Runnables" });
console.log("----TWEET----")
console.log(result.tweet);
console.log("----LINKDIN POST----")
console.log(result.linkdin);