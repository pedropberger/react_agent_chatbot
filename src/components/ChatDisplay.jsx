const ChatDisplay = ({ messages, isLoading, onRateResponse }) => {
    // Function to copy text to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            // Show toast notification (simplified version)
            alert("Texto copiado para a área de transferência!");
        }).catch(err => {
            console.error('Erro ao copiar texto: ', err);
        });
    };
    
    // Function to format timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "";
        
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex-grow p-4 overflow-y-auto">
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                        <i className="fas fa-comments text-4xl mb-2"></i>
                        <p>Envie uma mensagem para começar a conversa</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`p-3 rounded-lg max-w-3xl ${
                                message.role === 'user' 
                                    ? 'bg-blue-100 ml-auto' 
                                    : message.role === 'error'
                                        ? 'bg-red-100'
                                        : 'bg-gray-100'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold">
                                    {message.role === 'user' ? 'Você' : message.role === 'error' ? 'Erro' : 'Bot'}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {formatTimestamp(message.timestamp)}
                                </span>
                            </div>
                            
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            
                            {/* Action buttons for bot messages */}
                            {message.role === 'bot' && (
                                <div className="flex justify-end mt-2 space-x-2">
                                    {/* Copy button */}
                                    <button 
                                        onClick={() => copyToClipboard(message.content)}
                                        className="text-gray-500 hover:text-gray-700"
                                        title="Copiar para área de transferência"
                                    >
                                        <i className="fas fa-copy"></i>
                                    </button>
                                    
                                    {/* Rating buttons */}
                                    <button 
                                        onClick={() => onRateResponse(index, 'positive')}
                                        className={`${message.rating === 'positive' ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                                        title="Avaliar positivamente"
                                    >
                                        <i className="fas fa-thumbs-up"></i>
                                    </button>
                                    <button 
                                        onClick={() => onRateResponse(index, 'negative')}
                                        className={`${message.rating === 'negative' ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                                        title="Avaliar negativamente"
                                    >
                                        <i className="fas fa-thumbs-down"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="p-3 rounded-lg bg-gray-100 max-w-3xl">
                            <div className="flex items-center space-x-2">
                                <div className="text-gray-600">Bot está digitando</div>
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};