import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5003;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash";

app.use(express.json());
app.use(cors());

app.post("/fetch-schemes", async (req, res) => {
    try {
        const { filterQuery } = req.body;
        const fullQuery = `${filterQuery} Ensure that each scheme includes a valid official application URL. If an official URL is not available, provide a relevant government website link.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Return only JSON. Do NOT include any Markdown formatting or extra text. Query: "${fullQuery}"`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));

        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            return res.status(400).json({ error: "Invalid response from API" });
        }

        let textResponse = data.candidates[0].content.parts[0].text.trim();

        if (textResponse.startsWith("```json")) {
            textResponse = textResponse.replace(/^```json/, "").replace(/```$/, "").trim();
        }

        let schemes;
        try {
            schemes = JSON.parse(textResponse);
        } catch (error) {
            return res.status(400).json({ error: "Failed to parse JSON from API response" });
        }

        res.json(schemes);
    } catch (error) {
        console.error("Error fetching schemes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
