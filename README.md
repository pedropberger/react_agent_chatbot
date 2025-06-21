# Chatbot Interface with React

## Overview
This is a development web application that provides a lightweight and modern interface for interacting with AI agents via API. This app is specifically designed for testing and debugging AI agents during development. Users can send prompts, view responses, access chat history in the sidebar, and interact with responses (copy to clipboard or rate them as positive/negative). The application is built with React, styled with Tailwind CSS, and connects to an API running on localhost:1234.

## Features

- **Prompt Submission**: Send questions or prompts to the AI agent API and receive responses in real-time.
- **Chat History**: View previous interactions in a sidebar, with the option to review complete chats.
- **Response Interaction**: Copy responses to the clipboard or rate them with thumbs up/down.
- **Lightweight UI**: Responsive and minimalist interface, optimized for performance with Tailwind CSS.
- **API Status Monitoring**: Real-time monitoring of the API connection status with automatic detection of CORS issues.
- **CORS Proxy Support**: Built-in support for a CORS proxy to help with development and testing.

## Technologies Used

- **Frontend**: React, Tailwind CSS, Babel (via CDN)
- **Backend**: Integration with existing API running on localhost:1234
- **State Management**: React Hooks (useState, useEffect)
- **Others**: UUID for chat identification

## Prerequisites

- Node.js (optional, only for local development with additional tools)
- AI agent API running on localhost:1234
- Modern browser (Chrome, Firefox, Edge)

## Installation

Clone the repository:
```
git clone https://github.com/your-username/chatbot-react.git
cd chatbot-react
```

**Option 1**: Open the index.html file directly in the browser (no server needed for the basic version with CDNs).

**Option 2**: For development with a local server:
```
npm install
npm start
```

This will start a local server using the `serve` package.

**CORS Proxy** (optional, for development with CORS issues):
```
node cors-proxy.js
```

Make sure the AI agent API is running on localhost:1234.

## Usage

1. Access the application in the browser.
2. Type a prompt in the main text area and click "Send".
3. The API response will be displayed below the prompt.
4. Chat history appears in the left sidebar. Click on a chat to review it.
5. For each response:
   - Click the copy icon to copy the text.
   - Click the thumbs up/down icons to rate the response.
6. If you encounter API connectivity issues:
   - Check the API status indicator at the top of the interface
   - Enable the CORS proxy option if needed (requires running the cors-proxy.js script)

## Project Structure
```
chatbot-react/
├── index.html          # Application entry point
├── cors-proxy.js       # CORS proxy for development
├── src/
│   ├── components/     # React components (ChatInput, ChatHistory, ChatDisplay)
│   └── App.jsx         # Main component
├── README.md           # Documentation
└── package.json        # Dependencies (optional)
```

## Development Purpose
This application is specifically designed for testing and debugging AI agents during development. It provides a convenient interface to:
- Test prompt engineering and response quality
- Debug API connectivity issues
- Evaluate agent behavior and performance
- Save and review conversation history
- Collect feedback on responses

## License
MIT License. See the LICENSE file for details.