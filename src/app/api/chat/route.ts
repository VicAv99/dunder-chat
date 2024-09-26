import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// export async function POST(req: Request) {
//   const { messages, systemPrompt } = await req.json();

//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     stream: true,
//     messages: [{ role: "system", content: systemPrompt }, ...messages],
//   });

//   return new Response(response.toReadableStream());
// }

export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    messages = [],
    systemPrompt,
  }: { messages: unknown; systemPrompt: string } = await req.json();

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
