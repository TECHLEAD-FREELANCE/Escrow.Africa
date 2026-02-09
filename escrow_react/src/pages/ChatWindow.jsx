import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, MoreVertical } from 'lucide-react';
import useAuthStore from '../stores/authStore';

export default function ChatWindow() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const user = useAuthStore((state) => state.user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Sample contact data
  const contact = {
    id: userId,
    name: 'Sarah Kimani',
    online: true,
    dealId: 'ESC001'
  };
  
  // Sample initial messages
  useEffect(() => {
    setMessages([
      { id: 1, sender: 'other', text: 'Hi! I\'m interested in your website development project.', timestamp: new Date(Date.now() - 3600000) },
      { id: 2, sender: 'me', text: 'Great! Can you show me some of your previous work?', timestamp: new Date(Date.now() - 3500000) },
      { id: 3, sender: 'other', text: 'Sure! I\'ve sent you the portfolio link.', timestamp: new Date(Date.now() - 3400000) },
      { id: 4, sender: 'me', text: 'Looks impressive! When can we start?', timestamp: new Date(Date.now() - 3300000) },
      { id: 5, sender: 'other', text: 'I can start immediately once the payment is confirmed.', timestamp: new Date(Date.now() - 3200000) },
    ]);
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Simulated auto-reply
  const simulateReply = (userMessage) => {
    setTyping(true);
    
    setTimeout(() => {
      const replies = [
        'That sounds good to me!',
        'Yes, I agree.',
        'Let me check and get back to you.',
        'Perfect! I\'ll proceed with that.',
        'Thanks for the update!',
      ];
      
      const reply = replies[Math.floor(Math.random() * replies.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'other',
        text: reply,
        timestamp: new Date()
      }]);
      
      setTyping(false);
    }, 2000);
  };
  
  const handleSend = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate reply
    simulateReply(message);
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/chat')} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              {contact.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">{contact.name}</h2>
              <p className="text-xs text-teal-600">Deal: {contact.dealId}</p>
            </div>
          </div>
          
          <button className="p-2">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.sender === 'me'
                  ? 'bg-teal-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === 'me' ? 'text-teal-100' : 'text-gray-500'
                }`}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSend} className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
