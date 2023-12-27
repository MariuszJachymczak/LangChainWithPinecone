import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatPromptTemplate } from 'langchain/prompts';
import {
  RunnableLambda,
  RunnableMap,
  RunnablePassthrough,
} from 'langchain/runnables';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';

const apiKey = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY;
const vectorStore = await HNSWLib.fromDocuments(
  [
    new Document({ pageContent: 'Harrison worked at Kensho' }),
    new Document({ pageContent: 'Bears like to eat honey.' }),
  ],
  new OpenAIEmbeddings({ openAIApiKey: apiKey })
);
const retriever = vectorStore.asRetriever(1);

const prompt = ChatPromptTemplate.fromMessages([
  [
    'ai',
    `Answer the question based on only the following context:

{context}`,
  ],
  ['human', '{question}'],
]);
const model = new ChatOpenAI({});
const outputParser = new StringOutputParser();

const setupAndRetrieval = RunnableMap.from({
  context: new RunnableLambda({
    func: (input: string) =>
      retriever.invoke(input).then(response => response[0].pageContent),
  }).withConfig({ runName: 'contextRetriever' }),
  question: new RunnablePassthrough(),
});
const chain = setupAndRetrieval.pipe(prompt).pipe(model).pipe(outputParser);

export const ragResponse = await chain.invoke('Where did Harrison work?');
console.group('RAG as Response');
console.log(ragResponse);
console.groupEnd();
