import { useState, useRef, useEffect } from 'react';
import { serverUrl } from '../App'; // ✨ NEW: Import the global URL

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI Chef. What are you craving today? 👨‍🍳", isBot: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // This helps the chat automatically scroll to the bottom when a new message appears
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. Add the user's message to the chat window
    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput(''); // Clear the input box
    setIsLoading(true);

    try {
      // 2. Send the message to your Node.js backend
      const response = await fetch(`${serverUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      
      const data = await response.json();
      
      // 3. Add the AI's reply to the chat window
      setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { text: "Sorry, the kitchen is too busy right now! Try again later.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* If chat is open, show the chat window. If closed, show the round button. */}
      {isOpen ? (
        <div className="w-[340px] h-[480px] bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-300">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#ff4d2d] to-[#e64526] text-white p-4 flex justify-between items-center shadow-md">
            <strong className="text-lg font-extrabold tracking-wide flex items-center gap-2">
                ✨ AI Chef
            </strong>
            <button 
                onClick={() => setIsOpen(false)} 
                className="text-white hover:text-gray-200 bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
            >
                ✕
            </button>
          </div>
          
          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-[#f8f9fa] dark:bg-[#121212] transition-colors duration-300 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[85%] px-4 py-2.5 text-sm shadow-sm ${
                    msg.isBot 
                    ? 'self-start bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-sm border border-gray-100 dark:border-gray-700' 
                    : 'self-end bg-[#ff4d2d] text-white rounded-2xl rounded-br-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="self-start bg-white dark:bg-[#2a2a2a] text-gray-500 dark:text-gray-400 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm border border-gray-100 dark:border-gray-700 font-medium animate-pulse">
                Chef is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-800 flex gap-2 transition-colors duration-300">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask for food recommendations..." 
              className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm transition-colors"
            />
            <button 
                onClick={sendMessage} 
                disabled={isLoading} 
                className="px-5 py-2.5 bg-[#ff4d2d] hover:bg-[#e64526] disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button 
            onClick={() => setIsOpen(true)} 
            className="px-6 py-4 bg-gradient-to-r from-[#ff4d2d] to-[#e64526] hover:from-[#e64526] hover:to-[#cc3e22] text-white rounded-full cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1 font-extrabold flex items-center gap-2 transition-all duration-300"
        >
          ✨ Chat with AI
        </button>
      )}
    </div>
  );
};

export default Chatbot;
