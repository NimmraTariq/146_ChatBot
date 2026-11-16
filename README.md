# 146_ChatBot

A web-based chatbot built with Express.js. The browser sends the conversation to the Express API, which streams responses from OpenRouter.

## Project links

- **GitHub:** [NimmraTariq/146_ChatBot](https://github.com/NimmraTariq/146_ChatBot)
- **Vercel:** Not deployed yet

## Requirements

- Node.js 18 or newer
- An OpenRouter API key

## Run locally

Install the project dependencies:

```bash
npm install
```

Create a `.env` file in the project root and add your key:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

Start the server:

```bash
node index.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Keep the API key in the server-side `.env` file; do not put it in browser code or commit it.

## Chat API

`POST /api/chat` accepts a JSON body containing a `messages` array:

```json
{
  "messages": [
    { "role": "user", "content": "Halo! Ada yang bisa saya bantu?" }
  ]
}
```

The endpoint streams the assistant response as Server-Sent Events.

## Screenshot

The chatbot screenshot will be added in a follow-up commit.
