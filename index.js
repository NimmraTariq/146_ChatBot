const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static ("public"));

app.get("/", (req, res) => {
    res.redirect("index.html");
});

app.post("/api/chat", async (req, res) => {
    try {
        const messages  = req.body.messages;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Messages must be an array" });
        }

        const response = await fetch(
            "https://api.openrouter.ai/v1/chat/completions", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
                },
                body: JSON.stringify({
                    model: "inclusional/ling-3.2-flash:free",
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: true
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.text();    

            console.error("OpenRouter Error:", errorData);
            return res.status(response.status).json({ 
                error: errorData 
            });
        }

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const processLine = (line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith("data:")) {
                return;
            }

            const data = trimmedLine.slice(5).trim();
            if (!data || data === "[DONE]") {
                return;
            }

            const chunk = JSON.parse(data);
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
                res.write(`data: ${JSON.stringify(content)}\n\n`);
            }
        };

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                processLine(line);
            }
        }

        buffer += decoder.decode();
        if (buffer) {
            processLine(buffer);
        }

        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error) {
        console.error("Chat request failed:", error);
        if (res.headersSent) {
            return res.end();
        }
        return res.status(502).json({ error: "Unable to complete chat request." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


