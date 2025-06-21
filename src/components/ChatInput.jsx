const { useState } = React;

const ChatInput = ({ onSendPrompt, isLoading, disabled }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading && !disabled) {
            onSendPrompt(prompt);
            setPrompt('');
        }
    };

    // Determine if the input should be disabled
    const isDisabled = isLoading || disabled;

    return (
        <div className="border-t border-gray-200 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={disabled ? "API indisponível. Verifique o servidor." : "Digite sua mensagem aqui..."}
                    className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isDisabled}
                />
                <button
                    type="submit"
                    className={`px-4 py-2 rounded text-white ${
                        isDisabled || !prompt.trim() 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={isDisabled || !prompt.trim()}
                    title={disabled ? "API indisponível" : isLoading ? "Enviando..." : "Enviar mensagem"}
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enviando...
                        </span>
                    ) : (
                        'Enviar'
                    )}
                </button>
            </form>
        </div>
    );
};