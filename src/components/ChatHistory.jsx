const ChatHistory = ({ chatHistory, currentChatId, onSelectChat, onNewChat }) => {
    // Function to get chat preview text
    const getChatPreview = (chat) => {
        if (chat.messages.length === 0) return "Nova conversa";
        
        // Get first user message as preview
        const firstUserMessage = chat.messages.find(msg => msg.role === 'user');
        if (firstUserMessage) {
            // Limit preview length
            const preview = firstUserMessage.content;
            return preview.length > 30 ? preview.substring(0, 30) + '...' : preview;
        }
        
        return "Nova conversa";
    };
    
    // Function to format timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col h-full">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold">Histórico</h2>
            </div>
            
            {/* New Chat Button */}
            <button 
                onClick={onNewChat}
                className="m-3 p-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
            >
                <i className="fas fa-plus mr-2"></i>
                Nova Conversa
            </button>
            
            {/* Chat History List */}
            <div className="flex-grow overflow-y-auto">
                {chatHistory.length === 0 ? (
                    <div className="p-4 text-gray-400 text-center">
                        Nenhuma conversa anterior
                    </div>
                ) : (
                    <ul>
                        {chatHistory.map((chat) => (
                            <li 
                                key={chat.id} 
                                onClick={() => onSelectChat(chat.id)}
                                className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                                    chat.id === currentChatId ? 'bg-gray-700' : ''
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="truncate flex-grow">
                                        {getChatPreview(chat)}
                                    </div>
                                    {chat.messages.length > 0 && (
                                        <div className="text-xs text-gray-400">
                                            {formatTime(chat.messages[0].timestamp)}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};