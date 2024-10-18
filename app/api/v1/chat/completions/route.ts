/**
 * 向量相似度搜索 API
 */
import { AlibabaTongyiEmbeddings } from "@langchain/community/embeddings/alibaba_tongyi";
import {
  PGVectorStore,
} from "@langchain/community/vectorstores/pgvector";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  Runnable,
  RunnableMap,
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";

import { config } from "@/app/db/embeddings";
import { PromptTemplate } from "@langchain/core/prompts";
import jwt from 'jsonwebtoken'
import {decodeBase64} from "@/lib/utils";
import {getUser} from "@/app/login/actions";
import {decodeJwt} from "jose";
import {initializeAgentExecutorWithOptions} from "langchain/agents";

const OpenAIConfig = {
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-3.5-turbo-0125'
}
// const OpenAIConfig = {
//   baseURL: 'https://api.moonshot.cn/v1',
//   apiKey: process.env.KIMI_API_KEY,
//   model: 'moonshot-v1-8k'
// }


if (!process.env.ALIBABA_API_KEY) {
  throw new Error("Missing environment variable ALIBABA_API_KEY");
}

interface JWT {
  user: {
    id: string
    email: string
  },
  exp: number,
  iat: number
}
export async function POST(request: Request) {
  const auth = request.headers.get("Authorization")?.split('Bearer ')[1];
  if (!auth) return new Response("Unauthorized", { status: 401 })
  const decoded =decodeJwt(auth) as JWT
  console.log(decoded);
  const user = await getUser(decoded.user.email)
  if (!user || user?.id !== decoded.user.id) return new Response("Unauthorized", { status: 401 })
  const { messages, stream: streamOption } = await request.json();

  const query = messages[messages.length - 1].content;

  const pgvectorStore = await PGVectorStore.initialize(
    new AlibabaTongyiEmbeddings({
      apiKey: process.env.ALIBABA_API_KEY,
      parameters: {
        //@ts-expect-error
        text_type: "query",
      },
    }),
    config,
  );

  const retriever = pgvectorStore.asRetriever({
    k: 10,
    searchType: "similarity",
  });

  // const llm = new ChatAlibabaTongyi({
  //   alibabaApiKey: process.env.ALIBABA_API_KEY,
  //   streaming: true
  // });

  const llm = new ChatOpenAI({
    apiKey: OpenAIConfig.apiKey,
    model: OpenAIConfig.model,
    configuration: {
      baseURL: OpenAIConfig.baseURL,
    },
  });

  const template = `
  你是一个北大附中的智能助手，根据文档相关内容回答问题
  {context}
  Question: {question}
  `;

  const prompt = PromptTemplate.fromTemplate(template);

  const ragChainFromDocs = RunnableSequence.from([
    RunnablePassthrough.assign({
      //@ts-expect-error
      context: (input) => formatDocumentsAsString(input.context),
    }),
    prompt,
    llm,
    new StringOutputParser(),
  ]);

  let ragChainWithSource: Runnable = new RunnableMap({
    steps: { context: retriever, question: new RunnablePassthrough() },
  });

  ragChainWithSource = ragChainWithSource.assign({ answer: ragChainFromDocs });

  await ragChainWithSource.invoke(query);

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };

  const stream = new ReadableStream({
    async start(controller) {
      // Stream each chunk as it arrives from ragChainWithSource
      for await (const chunk of await ragChainWithSource.stream(query)) {
        if (chunk.hasOwnProperty("answer")) {
          const formattedData = `data: ${JSON.stringify({
            choices: [
              {
                delta: {
                  content: chunk.answer,
                },
              },
            ],
          })}\n\n`;
          controller.enqueue(formattedData);
        }
      }
      controller.close();
    },
  });

  return new Response(stream, { headers, status: 200 });
}
