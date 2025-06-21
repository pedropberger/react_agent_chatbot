const { useState, useEffect } = React;

// API configuration
const API_CONFIG = {
    baseUrl: 'http://localhost:1234',
    proxyUrl: 'http://localhost:8080',
    useProxy: false
};

// Function to get the API URL based on configuration
const getApiUrl = () => {
    return API_CONFIG.useProxy ? API_CONFIG.proxyUrl : API_CONFIG.baseUrl;
};

const App = () => {
    // State for storing chat history
    const [chatHistory, setChatHistory] = useState([]);
    // State for current chat
    const [currentChat, setCurrentChat] = useState({
        id: crypto.randomUUID(),
        messages: []
    });
    // State for loading status
    const [isLoading, setIsLoading] = useState(false);
    // State for API status
    const [apiStatus, setApiStatus] = useState({
        online: false,
        partial: false,
        checked: false,
        checking: false
    });
    // State for proxy usage
    const [useProxy, setUseProxy] = useState(API_CONFIG.useProxy);

    // Function to handle sending a new prompt
    const handleSendPrompt = async (prompt) => {
        setIsLoading(true);
        
        // Add user message to current chat
        const updatedChat = {
            ...currentChat,
            messages: [
                ...currentChat.messages,
                { role: 'user', content: prompt, timestamp: new Date().toISOString() }
            ]
        };
        setCurrentChat(updatedChat);
        
        try {
            // Send prompt to API - using configured URL
            const response = await fetch(`${getApiUrl()}/api/prompt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Add bot response to current chat
            const finalChat = {
                ...updatedChat,
                messages: [
                    ...updatedChat.messages,
                    { role: 'bot', content: data.resposta, timestamp: new Date().toISOString() }
                ]
            };
            setCurrentChat(finalChat);
            
            // Update chat history
            updateChatHistory(finalChat);
        } catch (error) {
            console.error('Error sending prompt:', error);
            
            // Simple error message
            const errorMessage = 'Erro ao conectar com a API. Por favor, tente novamente.';
            
            // Add error message to chat
            setCurrentChat({
                ...updatedChat,
                messages: [
                    ...updatedChat.messages,
                    { role: 'error', content: errorMessage, timestamp: new Date().toISOString() }
                ]
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Function to update chat history
    const updateChatHistory = (chat) => {
        // Only add to history if there are messages
        if (chat.messages.length > 0) {
            setChatHistory(prevHistory => {
                // Check if chat already exists in history
                const existingIndex = prevHistory.findIndex(item => item.id === chat.id);
                
                if (existingIndex >= 0) {
                    // Update existing chat
                    const updatedHistory = [...prevHistory];
                    updatedHistory[existingIndex] = chat;
                    return updatedHistory;
                } else {
                    // Add new chat to history
                    return [...prevHistory, chat];
                }
            });
        }
    };

    // Function to select a chat from history
    const selectChat = (chatId) => {
        // Save current chat to history if it has messages
        if (currentChat.messages.length > 0) {
            updateChatHistory(currentChat);
        }
        
        // Find selected chat in history
        const selectedChat = chatHistory.find(chat => chat.id === chatId);
        if (selectedChat) {
            setCurrentChat(selectedChat);
        }
    };

    // Function to start a new chat
    const startNewChat = () => {
        // Save current chat to history if it has messages
        if (currentChat.messages.length > 0) {
            updateChatHistory(currentChat);
        }
        
        // Create new empty chat
        setCurrentChat({
            id: crypto.randomUUID(),
            messages: []
        });
    };

    // Function to handle rating a response
    const handleRateResponse = (messageIndex, rating) => {
        const updatedMessages = [...currentChat.messages];
        updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            rating
        };
        
        const updatedChat = {
            ...currentChat,
            messages: updatedMessages
        };
        
        setCurrentChat(updatedChat);
        updateChatHistory(updatedChat);
    };
    
    // Function to check API status
    const checkApiStatus = async () => {
        setApiStatus(prev => ({ ...prev, checking: true }));
        
        try {
            // Try OPTIONS request first (CORS preflight)
            const optionsResponse = await fetch(`${getApiUrl()}/api/prompt`, {
                method: 'OPTIONS',
                headers: {
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type',
                    'Origin': window.location.origin
                }
            });
            
            // Try a GET request to see if we get a 405 Method Not Allowed
            // This would indicate the endpoint exists but only accepts POST
            const getResponse = await fetch(`${getApiUrl()}/api/prompt`);
            
            // If we get here, the API is responding
            const partial = getResponse.status === 405;
            
            setApiStatus({
                online: true,
                partial: partial,
                checked: true,
                checking: false
            });
        } catch (error) {
            console.error('API status check error:', error);
            setApiStatus({
                online: false,
                partial: false,
                checked: true,
                checking: false
            });
        }
    };
    
    // Check API status on component mount and when proxy setting changes
    useEffect(() => {
        checkApiStatus();
    }, [useProxy]);

    return (
        <div className="flex flex-col h-full">
            {/* API Status Indicator */}
            <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
                <h1 className="text-lg font-bold">Chatbot Interface</h1>
                <div className="flex items-center">
                    <span className="text-sm mr-2">API Status:</span>
                    {apiStatus.checking ? (
                        <span className="flex items-center text-yellow-300">
                            <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verificando...
                        </span>
                    ) : apiStatus.online ? (
                        <span className="flex items-center text-green-400">
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Conectado ({useProxy ? 'via proxy' : 'direto'})
                        </span>
                    ) : apiStatus.partial ? (
                        <span className="flex items-center text-yellow-400">
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Parcial (CORS/405)
                        </span>
                    ) : (
                        <span className="flex items-center text-red-400">
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Desconectado
                        </span>
                    )}
                    <button 
                        onClick={checkApiStatus} 
                        className="ml-2 p-1 bg-gray-700 hover:bg-gray-600 rounded"
                        title="Verificar status da API"
                    >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div className="flex flex-grow">
                {/* Chat History Sidebar */}
                <ChatHistory 
                    chatHistory={chatHistory} 
                    currentChatId={currentChat.id} 
                    onSelectChat={selectChat} 
                    onNewChat={startNewChat} 
                />
                
                {/* Main Chat Area */}
                <div className="flex flex-col flex-grow h-full bg-white">
                    {/* API Status Warning */}
                    {apiStatus.checked && (apiStatus.partial || !apiStatus.online) && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                            <div className="flex justify-between">
                                <div className="flex">
                                    <div className="py-1">
                                        <svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold">
                                            {apiStatus.partial ? 'Aviso: API Parcialmente Disponível' : 'Aviso: API Indisponível'}
                                        </p>
                                        <p className="text-sm">
                                            {apiStatus.partial 
                                                ? 'O servidor API está respondendo a requisições OPTIONS, mas não a POST. Isso pode indicar um problema de CORS ou configuração do servidor.' 
                                                : `O servidor API (${getApiUrl()}) não está respondendo. Verifique se o servidor está rodando e tente novamente.`
                                            }
                                        </p>
                                        <ul className="text-sm list-disc list-inside mt-2">
                                            {apiStatus.partial ? (
                                                <>
                                                    <li>Erro 405 detectado: O servidor não aceita requisições GET ou não está configurado corretamente para POST</li>
                                                    <li>Verifique se o endpoint /api/prompt está configurado para aceitar requisições POST</li>
                                                    <li>Verifique se o servidor tem as configurações de CORS adequadas</li>
                                                    <li>Tente usar o proxy CORS abaixo para contornar o problema</li>
                                                </>
                                            ) : (
                                                <>
                                                    <li>Certifique-se de que o servidor API está rodando na porta 1234</li>
                                                    <li>Verifique se há erros no console do servidor</li>
                                                    <li>Se o problema persistir, pode ser um erro de CORS</li>
                                                </>
                                            )}
                                        </ul>
                                        
                                        {/* Proxy toggle */}
                                        <div className="mt-3 flex items-center">
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={useProxy} 
                                                    onChange={() => {
                                                        const newUseProxy = !useProxy;
                                                        setUseProxy(newUseProxy);
                                                        API_CONFIG.useProxy = newUseProxy;
                                                        // Check API status again after changing the setting
                                                        setTimeout(checkApiStatus, 500);
                                                    }}
                                                    className="sr-only peer"
                                                />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                <span className="ms-3 text-sm font-medium text-gray-700">
                                                    Usar proxy CORS (requer servidor proxy)
                                                </span>
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Para usar o proxy, execute <code className="bg-gray-200 px-1 rounded">node cors-proxy.js</code> em um terminal separado
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <button 
                                        onClick={checkApiStatus}
                                        disabled={apiStatus.checking}
                                        className={`px-3 py-1 rounded text-white ${
                                            apiStatus.checking ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    >
                                        {apiStatus.checking ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Verificando...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Tentar novamente
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Chat Display */}
                    <ChatDisplay 
                        messages={currentChat.messages} 
                        isLoading={isLoading} 
                        onRateResponse={handleRateResponse} 
                    />
                    
                    {/* Chat Input */}
                    <ChatInput 
                        onSendPrompt={handleSendPrompt} 
                        isLoading={isLoading} 
                        disabled={(!apiStatus.online || apiStatus.partial) && apiStatus.checked}
                    />
                </div>
            </div>
        </div>
    );
};