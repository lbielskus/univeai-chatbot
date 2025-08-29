'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface Memory {
  keyPoints: string[];
  lastUpdated: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memory, setMemory] = useState<Memory>({
    keyPoints: [],
    lastUpdated: new Date(),
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    const savedMemory = localStorage.getItem('chatMemory');

    if (savedMessages) {
      setMessages(
        JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      );
    }

    if (savedMemory) {
      setMemory({
        ...JSON.parse(savedMemory),
        lastUpdated: new Date(JSON.parse(savedMemory).lastUpdated),
      });
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Save memory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatMemory', JSON.stringify(memory));
  }, [memory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Extract key points from messages for memory
  const extractKeyPoints = (content: string): string[] => {
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 10);
    return sentences.slice(0, 2).map((s) => s.trim());
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          memory,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let assistantMessage = '';
      const decoder = new TextDecoder();

      // Create assistant message immediately
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        // Update the assistant message content immediately
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: assistantMessage }
              : msg
          )
        );
      }

      // Update memory with new key points
      const newKeyPoints = extractKeyPoints(assistantMessage);
      setMemory((prev) => ({
        keyPoints: [...prev.keyPoints, ...newKeyPoints].slice(-10), // Keep last 10 points
        lastUpdated: new Date(),
      }));
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      setMemory({ keyPoints: [], lastUpdated: new Date() });
      localStorage.removeItem('chatMessages');
      localStorage.removeItem('chatMemory');
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-lg h-[600px] flex flex-col'>
      {/* Header */}
      <div className='bg-blue-600 text-white p-4 rounded-t-lg'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold'>Unive Chatbot</h1>
            <p className='text-blue-100 text-sm'>
              Powered by OpenAI • Vercel AI SDK
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            {memory.keyPoints.length > 0 && (
              <div className='text-blue-100 text-xs'>
                Memory: {memory.keyPoints.length} points
              </div>
            )}
            <button
              onClick={clearChat}
              className='text-blue-100 hover:text-white text-sm underline'
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.length === 0 && !isLoading && (
          <div className='text-center text-gray-500 mt-8'>
            <p>Start a conversation by typing a message below!</p>
            <p className='text-sm mt-2'>
              Try asking me to calculate something or get weather info!
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 border border-blue-200 text-gray-900 shadow-sm'
              }`}
            >
              <p className='text-sm font-medium'>{message.content}</p>
              <p className='text-xs text-gray-500 mt-1'>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className='flex justify-center'>
            <div className='bg-gray-100 rounded-lg px-4 py-2'>
              <p className='text-gray-600'>Thinking...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className='p-4 border-t'>
        <div className='flex space-x-2'>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Type your message here...'
            className='flex-1 border rounded-lg px-3 py-2 resize-none'
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50'
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
