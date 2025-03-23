import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;  // Load API key from .env
const GEMINI_MODEL = "gemini-1.5-flash";

app.use(express.json());
app.use(cors());

// API Endpoint for Fetching Internships (Only from India)
app.post("/fetch-internships", async (req, res) => {
    try {
        const { field, duration, workType, stipend } = req.body;

        // Construct query dynamically based on filters
        let filterQuery = "Provide a JSON list of internship opportunities for women in India only.";
        filterQuery += " Each internship should include: title, company, field, duration, stipend, description, deadline, location, workType, and the application URL.";
        filterQuery += " The location must be within India. Exclude any internships from other countries.";

        if (field) filterQuery += ` Filter by field: ${field}.`;
        if (duration) filterQuery += ` Filter by duration: ${duration}.`;
        if (workType) filterQuery += ` Filter by work type: ${workType}.`;
        if (stipend) filterQuery += ` Filter by stipend: ${stipend}.`;

        filterQuery += " Return only a valid JSON response. Do NOT include Markdown formatting.";

        // Request data from Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: filterQuery }] }]
                })
            }
        );

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));

        // Validate API response
        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            return res.status(400).json({ error: "Invalid response from API" });
        }

        let textResponse = data.candidates[0].content.parts[0].text.trim();

        // Remove unnecessary Markdown formatting if present
        if (textResponse.startsWith("```json")) {
            textResponse = textResponse.replace(/^```json/, "").replace(/```$/, "").trim();
        }

        let internships;
        try {
            internships = JSON.parse(textResponse);  // Parse JSON response
        } catch (error) {
            return res.status(400).json({ error: "Failed to parse JSON from API response" });
        }

        // Filter internships to ensure they are only from India
        internships = internships.filter(internship => 
            internship.location?.toLowerCase().includes("india")
        );

        res.json(internships);
    } catch (error) {
        console.error("Error fetching internships:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
