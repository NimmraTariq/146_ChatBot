const path = require("node:path");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", (req, res) => {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "A non-empty message is required." });
    }

    res.json({
        reply: "Thanks for your message! This demo chat is ready for an AI service integration.",
    });
});

if (require.main === module) {
    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
        console.log(`Chatbot server listening on http://localhost:${port}`);
    });
}

module.exports = app;
