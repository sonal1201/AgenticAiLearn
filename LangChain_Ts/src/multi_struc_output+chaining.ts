import "dotenv/config";
import { z } from "zod"

import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { RunnableSequence } from "@langchain/core/runnables"

/// schema - this tells how the llms output will look like and their types ////

const reviewExtract = z.object({
    rating: z.number(),
    sentiment: z.enum(["positive", "negative"]),
    pros: z.array(z.string()),
    cons: z.array(z.string())
})

const reviveSummary = z.object({
    summary: z.string()
})

const reviewRecommendation = z.object({
    recommendation: z.string(),
})

/// ---- ////


const extractModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0
}).withStructuredOutput(reviewExtract)

const summaryModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
}).withStructuredOutput(reviveSummary)

const recommendationModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
}).withStructuredOutput(reviewRecommendation)

/// chaining -> the output of the first model automatically become the input for second model //// 

// const chain = RunnableSequence.from([
//     async (input: { review: string }) => {
//         return extractModel.invoke(
//             `Extract rating, sentiment, pros, and cons:\n${input.review}`
//         );
//     },
//     async (extracted) => {
//         return summaryModel.invoke(
//             `Summarize this structured review:\n${JSON.stringify(extracted)}`
//         );
//     },
//     async (summary) => {
//         return recommendationModel.invoke(
//             `Give a recommendation:\n${JSON.stringify(summary)}`
//         );
//     },
// ]);

/// ---- ////

const reviewText = `
Amazing phone! Super fast performance and long battery life,
but the camera quality is weak, display is not good in this price range.
`;

const result = await extractModel.invoke(
    `Extract rating, sentiment, pros, and cons:\n${reviewText}`
);


// const result = await chain.invoke({ review: reviewText });

console.log("\nFINAL OUTPUT:");
console.log(result);