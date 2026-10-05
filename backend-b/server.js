const express = require("express");

const app = express();

const PORT = 3002;

// Identify this server as Backend B
app.use((req, res, next) => {
    res.setHeader("X-Backend", "B");
    next();
});

// Basic endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Backend B is running",
        backend: "B"
    });
});

// Status endpoint
app.get("/api/status", (req, res) => {
    res.setHeader("Cache-Control", "max-age=60");

    res.json({
        backend: "B",
        status: "ok"
    });
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend B running on http://0.0.0.0:${PORT}`);
});