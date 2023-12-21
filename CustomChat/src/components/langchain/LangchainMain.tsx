import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from 'langchain/prompts';

const apiKey = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY;

const chatModel = new ChatOpenAI({ openAIApiKey: apiKey, temperature: 0.2 });

const text =
  'What would be a good company name for a company that makes colorful socks?';

const messages = [new HumanMessage({ content: text })];
const textInput = messages.map(message => message.content).join(' ');
const chatModelResult = await chatModel.predict(textInput);

const template = `You are a helpful assistance that translate {input_language} into {output_language}.`;

const humanTemplate = '{assistanceText}';

const chatPrompt = ChatPromptTemplate.fromMessages([
  ['system', template],
  ['human', humanTemplate],
]);

const formattedChatPrompt = await chatPrompt.format({
  input_language: 'English',
  output_language: 'Japanese',
  assistanceText:
    'Hello, I am a helpful assistance that translate English into Japanese.',
});

const LangchainRender: React.FC = () => {
  return (
    <div>
      <h1>{chatModelResult}</h1>
      <h1>{formattedChatPrompt}</h1>
    </div>
  );
};
export default LangchainRender;
