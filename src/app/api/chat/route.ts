import { NextRequest } from 'next/server';
import { generateText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const { messages, memory } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Provider
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Build system prompt with memory context
    const memoryContext =
      memory?.keyPoints?.length > 0
        ? `\nContext: ${memory.keyPoints.slice(-2).join('; ')}`
        : '';

    const systemPrompt = `You are Unive, a helpful AI assistant with calculator and weather tools.${memoryContext}\n\nUse tools when asked for calculations or weather. Be concise and accurate.`;

    // Tools using Vercel AI SDK v5 (cast to any to avoid type friction across versions)
    const calculator: any = tool({
      description: 'Calculate math expressions',
      inputSchema: z.object({
        expression: z.string().describe('Math expression to evaluate'),
      }),
      execute: ({ expression }: { expression: string }) => {
        try {
          const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
          // eslint-disable-next-line no-new-func
          const calcResult = Function(`'use strict'; return (${sanitized})`)();
          return `\n\nCalculation Result:\n${expression} = ${calcResult}`;
        } catch {
          return `\n\nError: Invalid mathematical expression`;
        }
      },
    } as any);

    const getWeather: any = tool({
      description: 'Get weather for location',
      inputSchema: z.object({
        location: z.string().describe('City or location name'),
      }),
      execute: ({ location }: { location: string }) => {
        const temperature = Math.floor(Math.random() * 30) + 10;
        const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
        const condition =
          conditions[Math.floor(Math.random() * conditions.length)];
        return `\n\nWeather for ${location}:\nTemperature: ${temperature}°C\nCondition: ${condition}`;
      },
    } as any);

    // Map incoming messages to AI SDK format
    const mappedMessages = (messages || []).map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    // Generate text with tools
    const result: any = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages: mappedMessages,
      tools: { calculator, get_weather: getWeather },
      maxTokens: 600,
      toolChoice: 'auto',
    } as any);

    try {
      console.log('AI SDK result text length:', (result?.text || '').length);
      console.log(
        'AI SDK toolResults:',
        Array.isArray(result?.toolResults) ? result.toolResults.length : 0
      );
      if (Array.isArray(result?.toolResults) && result.toolResults.length > 0) {
        try {
          console.log(
            'AI SDK first tool result:',
            JSON.stringify(result.toolResults[0])
          );
        } catch {}
      }
    } catch {}

    const toolText = Array.isArray(result?.toolResults)
      ? result.toolResults
          .map((r: any) => {
            if (typeof r === 'string') return r;
            if (typeof r?.output === 'string') return r.output;
            if (typeof r?.result === 'string') return r.result;
            if (typeof r?.result?.content === 'string') return r.result.content;
            if (r?.result != null) return JSON.stringify(r.result);
            return '';
          })
          .join('\n')
      : '';

    const combined = `${result?.text || ''}${toolText || ''}`.trim();
    const finalText =
      combined.length > 0
        ? combined
        : 'I could not generate a response. Please try again.';

    return new Response(finalText, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('❌ Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
}
