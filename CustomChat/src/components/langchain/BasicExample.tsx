import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate } from 'langchain/prompts';
import { AIMessage } from 'langchain/schema';
import { StringOutputParser } from 'langchain/schema/output_parser';

const apiKey = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY;
const model = new ChatOpenAI({ openAIApiKey: apiKey, temperature: 0.2 });

const prompt = ChatPromptTemplate.fromMessages([
  ['human', 'Tell me joke about {topic}'],
]);

const outputParser = new StringOutputParser();
const chain = prompt.pipe(model).pipe(outputParser);

export const response = await chain.invoke({ topic: 'Poles' });

const promptValue = await prompt.invoke({ topic: 'Germans' });

const promptAsMessages = promptValue.toChatMessages();

const promptAsString = 'Human: Tell me a short joke about ice cream';
const stringAsResponse = await model.invoke(promptAsString);

const message = new AIMessage(
  'Sure, here you go: Why did the ice cream go to school? Because it wanted to get a little "sundae" education!'
);
const parsed = await outputParser.invoke(message);

console.group('Prompt Value');
console.log(promptValue);
console.groupEnd();

console.group('Prompt as Messages');
console.log(promptAsMessages);
console.groupEnd();

console.group('String as Response');
console.log(stringAsResponse);
console.groupEnd();

console.group('Parsed Message');
console.log(parsed);
console.groupEnd();
