import { OpenAI } from "langchain/llms/openai";
import dotenv from "dotenv";

dotenv.config();
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
console.log (apiKey)
const llm = new OpenAI({
  openAIApiKey: "YOUR_KEY_HERE",
});