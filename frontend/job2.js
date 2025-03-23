import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash";

app.use(express.json());
app.use(cors());

app.post("/fetch-jobs", async (req, res) => {
    try {
        const { jobType, location, experience, industry, salaryRange } = req.body;

        const fullQuery = `Generate job listings for India only based on these filters:
        - Job Type: ${jobType || "Any"}
        - Location: ${location || "Anywhere in India"}
        - Experience Level: ${experience || "All Levels"}
        - Industry: ${industry || "All Industries"}
        - Salary Range: ${salaryRange || "Any Range"}
        
        Ensure all jobs are based in India and mention the city or state (e.g., Bangalore, Maharashtra, Delhi).
        Return only JSON in the format:
        [
          {
            "title": "Software Engineer",
            "company": "Tech Corp",
            "location": "Bangalore, India",
            "salary": "₹8,00,000 - ₹12,00,000 per annum",
            "jobType": "Full-time",
            "description": "We are looking for a skilled software engineer...",
            "skills": ["JavaScript", "React", "Node.js"],
            "applyUrl": "https://example.com/apply"
          }
        ]
        
        Make sure the salary format follows Indian conventions (₹ and per annum where applicable).
        If no jobs match, return an empty array [].`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: fullQuery }] }]
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

        let jobListings;
        try {
            jobListings = JSON.parse(textResponse);
        } catch (error) {
            return res.status(400).json({ error: "Failed to parse JSON from API response" });
        }

        if (!Array.isArray(jobListings)) {
            return res.status(400).json({ error: "API returned an invalid job list format" });
        }

        const cleanedJobs = jobListings.map(job => ({
            title: job.title || "Unknown Title",
            company: job.company || "Unknown Company",
            location: job.location || "Remote",
            salary: job.salary || "Not disclosed",
            jobType: job.jobType || "Not specified",
            description: job.description || "No description available.",
            skills: Array.isArray(job.skills) ? job.skills : [],
            applyUrl: job.applyUrl || "#"
        }));

        res.json(cleanedJobs);
    } catch (error) {
        console.error("Error fetching job listings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
