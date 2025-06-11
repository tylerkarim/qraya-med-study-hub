
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, MessageSquare } from 'lucide-react';

interface UserSearchProps {
  onStartChat: (username: string) => void;
  chats: any[];
  onUpdateChats: (chats: any[]) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onStartChat, chats, onUpdateChats }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [yearmates, setYearmates] = useState<any[]>([]);

  useEffect(() => {
    // Load all users and filter by year
    const allUsers = JSON.parse(localStorage.getItem('qraya_users') || '[]');
    const sameYearUsers = allUsers.filter((u: any) => 
      u.year === user?.year && u.username !== user?.username
    );
    setYearmates(sameYearUsers);
  }, [user]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem('qraya_users') || '[]');
    const results = allUsers.filter((u: any) => 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) && 
      u.username !== user?.username &&
      u.year === user?.year
    );
    
    setSearchResults(results);
  };

  const startChat = (username: string) => {
    // Check if chat already exists
    const existingChat = chats.find(chat => chat.with === username);
    if (!existingChat) {
      const newChat = {
        id: Date.now().toString(),
        with: username,
        messages: [],
        lastActivity: new Date().toISOString()
      };
      onUpdateChats([...chats, newChat]);
    }
    onStartChat(username);
    toast.success(`Started chat with ${username}`);
  };

  return (
    <div className="space-y-6">
      {/* Search Users */}
      <Card className="glass-card ios-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-medical-dark">
            Find Classmates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="rounded-xl"
            />
            <Button 
              onClick={handleSearch}
              className="rounded-xl bg-medical-blue hover:bg-medical-blue/90"
            >
              Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-medical-dark">Search Results:</h4>
              {searchResults.map(foundUser => (
                <div key={foundUser.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-medical-blue rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-medical-dark">{foundUser.username}</p>
                      <p className="text-xs text-gray-500">Year {foundUser.year}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => startChat(foundUser.username)}
                    className="rounded-xl bg-medical-teal hover:bg-medical-teal/90 text-white"
                  >
                    Chat
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Chats */}
      <Card className="glass-card ios-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-medical-dark">
            Your Chats
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chats.length > 0 ? (
            <div className="space-y-2">
              {chats.map(chat => (
                <div 
                  key={chat.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onStartChat(chat.with)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-medical-teal rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-medical-dark">{chat.with}</p>
                      <p className="text-xs text-gray-500">
                        {chat.messages.length} messages
                      </p>
                    </div>
                  </div>
                  <MessageSquare className="w-4 h-4 text-medical-blue" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No active chats yet</p>
              <p className="text-sm text-gray-400">Search for classmates to start chatting!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Year Mates */}
      <Card className="glass-card ios-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-medical-dark">
            Year {user?.year} Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          {yearmates.length > 0 ? (
            <div className="space-y-2">
              {yearmates.slice(0, 5).map(mate => (
                <div key={mate.id} className="flex items-center justify-between p-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-medical-blue/20 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-medical-blue" />
                    </div>
                    <span className="text-sm text-medical-dark">{mate.username}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startChat(mate.username)}
                    className="text-xs rounded-lg"
                  >
                    Chat
                  </Button>
                </div>
              ))}
              {yearmates.length > 5 && (
                <p className="text-xs text-gray-500 text-center">
                  +{yearmates.length - 5} more students
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No other Year {user?.year} students found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSearch;
