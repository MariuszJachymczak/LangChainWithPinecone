import express from 'express';
import { json } from 'body-parser';

import {
  ChatOpenAI,
  Document,
  OpenAIEmbeddings,
  ChatPromptTemplate,
  RunnableLambda,
  RunnableMap,
  RunnablePassthrough,
  StringOutputParser,
  HNSWLib,
} from 'langchain';

const app = express();
app.use(json());

const apiKey = process.env.OPENAI_API_KEY;

app.post('/getRagResponse', async (req, res) => {
  try {
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
        `Answer the question based on only the following context:\n\n{context}`,
      ],
      ['human', '{question}'],
    ]);
    const model = new ChatOpenAI({});
    const outputParser = new StringOutputParser();

    const setupAndRetrieval = RunnableMap.from({
      context: new RunnableLambda({
        func: input =>
          retriever.invoke(input).then(response => response[0].pageContent),
      }).withConfig({ runName: 'contextRetriever' }),
      question: new RunnablePassthrough(),
    });
    const chain = setupAndRetrieval.pipe(prompt).pipe(model).pipe(outputParser);

    const ragResponse = await chain.invoke(req.body.query);

    res.json({ response: ragResponse });
  } catch (error) {
    console.error('Wystąpił błąd:', error);
    res.status(500).send(error.toString());
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serwer uruchomiony na porcie ${port}`);
});
