
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import ChatInterface from '../components/ChatInterface';
import UserSearch from '../components/UserSearch';

const Community = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    const savedChats = localStorage.getItem(`qraya_chats_${user?.id}`);
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, [user?.id]);

  const updateChats = (newChats: any[]) => {
    setChats(newChats);
    localStorage.setItem(`qraya_chats_${user?.id}`, JSON.stringify(newChats));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-white to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medical-dark mb-2">
            Study Community
          </h1>
          <p className="text-gray-600">Connect with Year {user?.year} students</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserSearch 
              onStartChat={(username) => setActiveChat(username)}
              chats={chats}
              onUpdateChats={updateChats}
            />
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <ChatInterface 
              activeChat={activeChat}
              chats={chats}
              onUpdateChats={updateChats}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
