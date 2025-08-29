import { FloatingChat } from '@/components/chat/FloatingChat';
import {
  FiPlus,
  FiCloud,
  FiMessageCircle,
  FiZap,
  FiCheck,
  FiStar,
  FiTool,
} from 'react-icons/fi';

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Hero Section */}
      <div className='max-w-4xl mx-auto px-4 py-16 text-center'>
        <h1 className='text-5xl font-bold text-[#333333] mb-6'>
          Welcome to <span className='text-[#32c7f4]'>UniveAI</span>
        </h1>
        <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
          Your intelligent AI assistant powered by OpenAI. Get instant help with
          calculations, weather information, and much more through our floating
          chat interface.
        </p>

        <div className='bg-gradient-to-br from-white to-gray-50 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 mb-8 max-w-5xl mx-auto'>
          <h2 className='text-xl md:text-2xl font-bold text-[#333333] mb-6 text-center flex items-center justify-center'>
            <FiZap className='w-6 h-6 md:w-8 md:h-8 text-[#32c7f4] mr-3' />
            Project Implementation Summary
          </h2>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
              <h3 className='text-lg font-semibold text-[#32c7f4] mb-4 flex items-center '>
                <FiCheck className='w-5 h-5 text-green-500 mr-3' />
                Core Requirements Met
              </h3>
              <ul className='space-y-3 text-sm text-gray-600'>
                <li className='flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <span className='text-green-500 mr-3 mt-1 flex-shrink-0 w-4 text-center'>
                    ●
                  </span>
                  <span className='group-hover:text-[#32c7f4] transition-colors leading-relaxed flex-1 text-left'>
                    Built with Next.js and Vercel AI SDK v5
                  </span>
                </li>
                <li className='flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors '>
                  <span className='text-green-500 mr-3 mt-1 flex-shrink-0 w-4 text-center'>
                    ●
                  </span>
                  <span className='group-hover:text-[#32c7f4] transition-colors leading-relaxed flex-1 text-left'>
                    Chat agent powered by OpenAI's Responses API
                  </span>
                </li>
                <li className='flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <span className='text-green-500 mr-3 mt-1 flex-shrink-0 w-4 text-center'>
                    ●
                  </span>
                  <span className='group-hover:text-[#32c7f4] transition-colors leading-relaxed flex-1 text-left'>
                    Tool integration: Calculator & Weather API
                  </span>
                </li>
                <li className='flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <span className='text-green-500 mr-3 mt-1 flex-shrink-0 w-4 text-center'>
                    ●
                  </span>
                  <span className='group-hover:text-[#32c7f4] transition-colors leading-relaxed flex-1 text-left'>
                    Chat history persists across sessions
                  </span>
                </li>
                <li className='flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <span className='text-green-500 mr-3 mt-1 flex-shrink-0 w-4 text-center'>
                    ●
                  </span>
                  <span className='group-hover:text-[#32c7f4] transition-colors leading-relaxed flex-1 text-left'>
                    Long-term memory implementation
                  </span>
                </li>
              </ul>
            </div>

            <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
              <h3 className='text-lg font-semibold text-[#32c7f4] mb-4 flex items-center'>
                <FiStar className='w-5 h-5 text-yellow-500 mr-3' />
                Bonus Features Implemented
              </h3>
              <ul className='space-y-3 text-sm text-gray-600'>
                <li className='flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <span className='text-blue-500 mr-3 mt-1 flex-shrink-0 w-4 text-center'>
                    ●
                  </span>
                  <span className='group-hover:text-[#32c7f4] transition-colors leading-relaxed flex-1 text-left'>
                    Responsive, accessible UI design
                  </span>
                </li>
                <li className='flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <span className='text-blue-500 mr-3 mt-1 flex-shrink-0 w-4 text-center'>
                    ●
                  </span>
                  <span className='group-hover:text-[#32c7f4] transition-colors leading-relaxed flex-1 text-left'>
                    Smooth animations & polished interactions
                  </span>
                </li>
                <li className='flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <span className='text-blue-500 mr-3 mt-1 flex-shrink-0 w-4 text-center'>
                    ●
                  </span>
                  <span className='group-hover:text-[#32c7f4] transition-colors leading-relaxed flex-1 text-left'>
                    Professional React Icons integration
                  </span>
                </li>
                <li className='flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <span className='text-blue-500 mr-3 mt-1 flex-shrink-0 w-4 text-center'>
                    ●
                  </span>
                  <span className='group-hover:text-[#32c7f4] transition-colors leading-relaxed flex-1 text-left'>
                    Glassmorphism design elements
                  </span>
                </li>
                <li className='flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <span className='text-blue-500 mr-3 mt-1 flex-shrink-0 w-4 text-center'>
                    ●
                  </span>
                  <span className='group-hover:text-[#32c7f4] transition-colors leading-relaxed flex-1 text-left'>
                    Interactive feedback system
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className='mt-8 pt-8 border-t border-gray-200'>
            <h3 className='text-lg font-semibold text-[#32c7f4] mb-6 text-center flex items-center justify-center'>
              <FiTool className='w-5 h-5 mr-3' />
              Tech Stack Used
            </h3>
            <div className='flex flex-wrap justify-center gap-3'>
              <span className='bg-gradient-to-r from-[#32c7f4] to-[#2bb8e0] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105'>
                Next.js 14
              </span>
              <span className='bg-gradient-to-r from-[#32c7f4] to-[#2bb8e0] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105'>
                Vercel AI SDK v5
              </span>
              <span className='bg-gradient-to-r from-[#32c7f4] to-[#2bb8e0] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105'>
                OpenAI API
              </span>
              <span className='bg-gradient-to-r from-[#32c7f4] to-[#2bb8e0] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105'>
                Tailwind CSS
              </span>
              <span className='bg-gradient-to-r from-[#32c7f4] to-[#32c7f4] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105'>
                TypeScript
              </span>
              <span className='bg-gradient-to-r from-[#32c7f4] to-[#2bb8e0] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105'>
                React Icons
              </span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto'>
          <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
            <div className='flex justify-center mb-3'>
              <FiPlus className='w-12 h-12 text-[#32c7f4]' />
            </div>
            <h3 className='font-semibold text-[#333333] mb-2'>
              Smart Calculator
            </h3>
            <p className='text-gray-600 text-sm'>
              Get instant mathematical calculations and solutions
            </p>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
            <div className='flex justify-center mb-3'>
              <FiCloud className='w-12 h-12 text-[#32c7f4]' />
            </div>
            <h3 className='font-semibold text-[#333333] mb-2'>Weather Info</h3>
            <p className='text-gray-600 text-sm'>
              Check current weather conditions for any location
            </p>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
            <div className='flex justify-center mb-3'>
              <FiMessageCircle className='w-12 h-12 text-[#32c7f4]' />
            </div>
            <h3 className='font-semibold text-[#333333] mb-2'>AI Chat</h3>
            <p className='text-gray-600 text-sm'>
              Engage in intelligent conversations with AI
            </p>
          </div>
        </div>

        <div className='mt-12'>
          <p className='text-gray-500 text-sm'>
            Click the floating robot button in the bottom right corner to start
            chatting!
          </p>
        </div>
      </div>

      {/* Floating Chat Component */}
      <FloatingChat />
    </main>
  );
}
