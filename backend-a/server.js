const express = require("express");

const app = express();

const PORT = 3001;

// Identify this server as Backend A
app.use((req, res, next) => {
    res.setHeader("X-Backend", "A");
    next();
});

// Basic endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Backend A is running",
        backend: "A"
    });
});

// Status endpoint
app.get("/api/status", (req, res) => {
    res.setHeader("Cache-Control", "max-age=60");

    res.json({
        backend: "A",
        status: "ok"
    });
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend A running on http://0.0.0.0:${PORT}`);
});