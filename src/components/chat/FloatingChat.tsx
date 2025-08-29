'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FiSend,
  FiX,
  FiThumbsUp,
  FiThumbsDown,
  FiPlus,
  FiCloud,
  FiMessageCircle,
} from 'react-icons/fi';

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

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memory, setMemory] = useState<Memory>({
    keyPoints: [],
    lastUpdated: new Date(),
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [feedbackStates, setFeedbackStates] = useState<{
    [key: string]: 'up' | 'down' | 'report' | null;
  }>({});
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  // Handle user feedback (thumbs up/down, report) with toast notifications
  const handleFeedback = (
    messageId: string,
    type: 'up' | 'down' | 'report'
  ) => {
    const currentState = feedbackStates[messageId];
    const isUnmarking = currentState === type;

    setFeedbackStates((prev) => ({
      ...prev,
      [messageId]: isUnmarking ? null : type,
    }));

    // Only show toast when marking feedback, not when unmarking
    if (!isUnmarking) {
      let message = '';
      switch (type) {
        case 'up':
          message = 'Positive feedback submitted!';
          break;
        case 'down':
          message = 'Negative feedback submitted!';
          break;
        case 'report':
          message = 'Thanks for your report!';
          break;
      }

      setToast({ message, visible: true });

      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  // Clear all chat messages and memory, reset to initial state
  const clearChat = () => {
    setMessages([]);
    setMemory({
      keyPoints: [],
      lastUpdated: new Date(),
    });
    localStorage.removeItem('floatingChatMessages');
    localStorage.removeItem('floatingChatMemory');
  };

  // Close chat with smooth closing animation
  const handleCloseChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  // Toggle chat open/close with appropriate animations
  const handleToggleChat = () => {
    if (isOpen) {
      handleCloseChat();
    } else {
      setIsOpening(true);
      setIsOpen(true);
      setTimeout(() => {
        setIsOpening(false);
      }, 200);
    }
  };

  // Load chat history and memory from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('floatingChatMessages');
    const savedMemory = localStorage.getItem('floatingChatMemory');

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

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('floatingChatMessages', JSON.stringify(messages));
  }, [messages]);

  // Save memory to localStorage whenever memory changes
  useEffect(() => {
    localStorage.setItem('floatingChatMemory', JSON.stringify(memory));
  }, [memory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Extract key points from AI responses for memory system
  const extractKeyPoints = (content: string): string[] => {
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 10);
    return sentences.slice(0, 2).map((s) => s.trim());
  };

  // Send user message to AI and handle response
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Limit to 5 messages to prevent excessive API usage
    if (messages.length >= 10) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content:
            'You have reached the maximum number of messages (5). Please clear the chat to continue.',
          timestamp: new Date(),
        },
      ]);
      return;
    }

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

      const responseText = await response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const newKeyPoints = extractKeyPoints(responseText);
      setMemory((prev) => ({
        keyPoints: [...prev.keyPoints, ...newKeyPoints].slice(-10),
        lastUpdated: new Date(),
      }));
    } catch (error) {
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

  // Handle Enter key press to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp for display (e.g., "3:00 PM")
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <>
      {/* Floating Robot Button - Click to open/close chat */}
      <div className='fixed bottom-4 right-4 md:bottom-0 md:right-6 z-50'>
        <button
          onClick={handleToggleChat}
          className='w-24 h-24 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110'
        >
          <img
            src='/red_robot.jpg'
            alt='AI Assistant'
            className='w-20 h-20 md:w-36 md:h-36 rounded-full object-contain'
          />
        </button>
      </div>

      {/* Toast Notification - Shows feedback confirmation */}
      {toast.visible && (
        <div className='fixed bottom-[calc(70vh+120px)] md:bottom-[512px] right-4 left-4 md:right-8 md:left-auto z-50 w-auto md:w-96 bg-[#32c7f4]/80 backdrop-blur-md text-white px-4 py-3 shadow-lg border border-white/20 animate-in slide-in-from-top-2 duration-300'>
          <div className='flex items-center justify-center space-x-2'>
            <div className='w-2 h-2 bg-green-600 rounded-full'></div>
            <span className='text-sm font-medium'>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Chat Popup - Main chat interface */}
      {isOpen && (
        <div
          className={`fixed bottom-32 right-4 left-4 md:bottom-34 md:right-8 md:left-auto z-40 w-auto md:w-96 h-[70vh] md:h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-200 ease-out ${
            isClosing
              ? 'opacity-0 scale-95 translate-y-4'
              : isOpening
              ? 'opacity-0 scale-95 translate-y-4'
              : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          {/* Chat Header - Contains title, status, and control buttons */}
          <div className='bg-[#32c7f4]/80 backdrop-blur-md text-white p-3 rounded-t-2xl border border-white/20 shadow-lg relative'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <img
                  src='/red_robot.jpg'
                  alt='AI Assistant'
                  className='w-12 h-12 rounded-full object-contain'
                />
                <div className='flex items-center space-x-3'>
                  <h1 className='text-lg font-bold'>UniveAI</h1>
                  <p className='text-white text-sm font-medium bg-green-600 px-2 py-1 rounded-3xl text-center'>
                    Online
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={clearChat}
                  className='text-white hover:text-yellow-200 transition-colors text-sm font-medium'
                >
                  Clear
                </button>
                <button
                  onClick={handleCloseChat}
                  className='text-white  transition-colors hover:text-red-400'
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area - Scrollable chat messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 messages-scroll'>
            {messages.length === 0 && !isLoading && (
              <div className='text-center text-gray-500 mt-8'>
                <div className='flex justify-center mb-3'>
                  <FiMessageCircle className='w-8 h-8 text-gray-300' />
                </div>
                <p className='text-sm'>Start a conversation!</p>
                <p className='text-xs mt-2 text-gray-400'>
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
                {message.role === 'assistant' && (
                  <img
                    src='/red_robot.jpg'
                    alt='AI'
                    className='w-12 h-12 rounded-full object-contain mr-2'
                  />
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-[#32c7f4] text-[#ffffff]'
                      : 'bg-white border border-gray-200 text-[#333333] shadow-sm'
                  }`}
                >
                  <div className='text-sm leading-relaxed whitespace-pre-line'>
                    {message.content}
                  </div>
                  <div className='flex items-center justify-between mt-4'>
                    <p
                      className={`text-xs ${
                        message.role === 'user'
                          ? 'text-white'
                          : 'text-[#333333]'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                    {message.role === 'assistant' && (
                      <div className='flex items-center space-x-3'>
                        <button
                          onClick={() => handleFeedback(message.id, 'report')}
                          className={`transition-colors relative group ${
                            feedbackStates[message.id] === 'report'
                              ? 'text-yellow-500'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title='Report answer'
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              feedbackStates[message.id] === 'report'
                                ? 'border-yellow-500 bg-yellow-50'
                                : 'border-gray-400'
                            }`}
                          >
                            <span className='text-xs font-bold'>!</span>
                          </div>
                          <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10'>
                            Report answer
                            <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800'></div>
                          </div>
                        </button>
                        <div className='flex space-x-1'>
                          <button
                            onClick={() => handleFeedback(message.id, 'up')}
                            className={`transition-colors ${
                              feedbackStates[message.id] === 'up'
                                ? 'text-green-500'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            <FiThumbsUp size={12} />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, 'down')}
                            className={`transition-colors ${
                              feedbackStates[message.id] === 'down'
                                ? 'text-red-500'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            <FiThumbsDown size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2 self-end'>
                    <span className='text-xs text-gray-600'>You</span>
                  </div>
                )}
              </div>
            ))}

            {/* Loading State - Shows while AI is processing */}
            {isLoading && (
              <div className='flex justify-start'>
                <img
                  src='/red_robot.jpg'
                  alt='AI'
                  className='w-12 h-12 rounded-full object-contain mr-2'
                />
                <div className='bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm'>
                  <div className='flex space-x-1'>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                    <div
                      className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Message input and suggestion buttons */}
          <div className='p-4 border-t border-gray-200 bg-white rounded-b-2xl'>
            <div className='flex space-x-2'>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Type your message here...'
                className='flex-1 border border-gray-200 rounded-xl px-3 py-2 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#32c7f4] focus:border-transparent text-[#333333] placeholder-gray-500'
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className='bg-[#32c7f4] text-white p-2 rounded-xl px-8 hover:bg-[#2bb8e0] disabled:opacity-50 transition-colors flex items-center justify-center'
              >
                <FiSend size={20} />
              </button>
            </div>

            {/* Suggestion Chips - Quick action buttons for new users */}
            {messages.length === 0 && (
              <div className='flex space-x-2 mt-3'>
                <button
                  onClick={() => setInputValue('Calculate 25 * 17 + 8')}
                  className='bg-gray-100 text-[#333333] px-3 py-2 rounded-full text-xs hover:bg-gray-200 transition-colors flex items-center space-x-2'
                >
                  <FiPlus className='w-3 h-3' />
                  <span>Calculator</span>
                </button>
                <button
                  onClick={() => setInputValue("What's the weather in London?")}
                  className='bg-gray-100 text-[#333333] px-3 py-2 rounded-full text-xs hover:bg-gray-200 transition-colors flex items-center space-x-2'
                >
                  <FiCloud className='w-3 h-3' />
                  <span>Weather</span>
                </button>
                <button
                  onClick={() => setInputValue('Tell me about AI')}
                  className='bg-gray-100 text-[#333333] px-3 py-2 rounded-full text-xs hover:bg-gray-200 transition-colors flex items-center space-x-2'
                >
                  <FiMessageCircle className='w-3 h-3' />
                  <span>AI Info</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
