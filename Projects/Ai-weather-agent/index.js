import OpenAI from "openai";
import "dotenv/config";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const ai = new OpenAI({
  apiKey: GROQ_API_KEY,
});

function get_Weather_tool(city = "") {
  if (city.toLowerCase() == "delhi") return "14°C";
  if (city.toLowerCase() == "phagwara") return "10°C";
  if (city.toLowerCase() == "raipur") return "18°C";
  if (city.toLowerCase() == "banglore") return "8°C";
}

const SYSTEM_PROMPT = `You are an AI ASSISTANT with START, PLAN, ACTION, Observation and Output state.
                    Wait for the user input and plan using available tool.
                    After planning, take an action with appropite tool and wait for the obeservation based on action.
                    Once you get the observation, Return the Ai response based on Start prompt and observation.

                    Available tools:
                        - get_Weather_tool(string city): string
                    get_Weather_tool is a function thst accepts city name as string and return the weather details.

                    Example:
                        {"type":"user",  "content": "What is the weather of delhi?" },
                        {"type":"plan",  "content": "I will call get_Weather_tool for delhi" },
                        {"type":"action",  "function": "get_Weather_tool", "input": "delhi" },
                        {"type":"observation",  "observation": "14°C " }
                        {"type":"output",  "content": "The weather of delhi is 14°C." }

                    `;

const main = async () => {
  const response = await ai.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: "What is the weather of raipur?" },
    ],
  });

  console.log(response.choices[0]?.message?.content);
};

main();

// import OpenAI from "openai";
// import "dotenv/config";
// const GROQ_API_KEY = process.env.GROQ_API_KEY;


// const client = new OpenAI({
//   apiKey: process.env.GROQ_API_KEY,
//   baseURL: "https://api.groq.com/openai/v1",
// });

// const response = await client.responses.create({
//   model: "openai/gpt-oss-20b",
//   input: "Explain the importance of fast language models",
// });

// console.log(response.output_text);
