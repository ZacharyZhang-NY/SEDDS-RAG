import {siteConfig} from "@/siteConfig";

const exampleMessages = siteConfig.exampleMessages;

export async function POST(request: Request) {
  const { messages, stream: streamOption } = await request.json();
  const query = messages[messages.length - 1].content;

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };

  // Helper function to wait for a specified time
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const text = exampleMessages.filter((ex) => ex.message === query)[0].answer;
        const chunkSize = 1;

        for (let i = 0; i < text.length; i += chunkSize) {
          const chunk = text.slice(i, i + chunkSize);

          // Wait for 100ms before sending next chunk
          await delay(100);

          const formattedData = `data: ${JSON.stringify({
            choices: [
              {
                delta: {
                  content: chunk,
                },
              },
            ],
          })}\n\n`;

          controller.enqueue(formattedData);
        }

        // Send [DONE] event to signal the end of the stream
        controller.enqueue(`data: [DONE]\n\n`);
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, { headers, status: 200 });
}