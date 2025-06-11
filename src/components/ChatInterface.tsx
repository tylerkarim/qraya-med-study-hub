
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  from: string;
  content: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  activeChat: string | null;
  chats: any[];
  onUpdateChats: (chats: any[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeChat, chats, onUpdateChats }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(chat => chat.with === activeChat);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChat?.messages]);

  const sendMessage = () => {
    if (!message.trim() || !activeChat || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from: user.username,
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedChats = chats.map(chat => {
      if (chat.with === activeChat) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastActivity: new Date().toISOString()
        };
      }
      return chat;
    });

    onUpdateChats(updatedChats);
    setMessage('');

    // Simulate receiving messages from other users (for demo purposes)
    setTimeout(() => {
      const responses = [
        "That's really helpful, thanks!",
        "I'm working on that topic too",
        "Have you tried using flashcards?",
        "Good luck with your studies!",
        "Let's study together sometime",
        "That exam was challenging",
        "I found a great resource for that"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: activeChat,
        content: randomResponse,
        timestamp: new Date().toISOString()
      };

      const finalUpdatedChats = updatedChats.map(chat => {
        if (chat.with === activeChat) {
          return {
            ...chat,
            messages: [...chat.messages, responseMessage],
            lastActivity: new Date().toISOString()
          };
        }
        return chat;
      });

      onUpdateChats(finalUpdatedChats);
    }, 1000 + Math.random() * 2000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!activeChat) {
    return (
      <Card className="glass-card ios-shadow h-[600px]">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-medical-dark mb-2">
              Select a chat to start messaging
            </h3>
            <p className="text-gray-600">
              Search for classmates or select from your existing chats
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card ios-shadow h-[600px] flex flex-col">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-bold text-medical-dark">
          Chat with {activeChat}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {currentChat?.messages.map((msg: Message) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === user?.username ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    msg.from === user?.username
                      ? 'medical-gradient text-white'
                      : 'bg-gray-100 text-medical-dark'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.from === user?.username ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {(!currentChat?.messages || currentChat.messages.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400">Start the conversation!</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="rounded-xl"
            />
            <Button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="rounded-xl medical-gradient text-white"
            >
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
