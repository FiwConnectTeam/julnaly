
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const helmet = require("helmet");

const { globalLimiter, authLimiter } = require("./middleware/rate_limiter");
const authRoute = require("./routes/authRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Remove the "X-Powered-By: Express" header so attackers can't easily identify your server framework
app.disable('x-powered-by');
// Apply Helmet middleware to set security-related HTTP response headers
app.use(
    helmet({
        // Content Security Policy (CSP): Controls which resources (scripts, styles, images) the browser is allowed to load
        contentSecurityPolicy: {
            directives: {
                // Fallback rule: By default, only allow loading any resource from your own domain ('self')
                defaultSrc: ["'self'"],
                // JavaScript: Only allow executing scripts hosted on your own domain (blocks injected inline scripts / XSS)
                scriptSrc: ["'self'"],
                // CSS: Only allow stylesheets hosted on your own domain
                styleSrc: ["'self'"],
                // Images: Allow images from your own domain and inline base64 data URIs
                imgSrc: ["'self'", "data:"],
                // Network requests: Restrict fetch, XHR, and WebSocket connections to your own domain
                connectSrc: ["'self'"],
                // Fonts: Only allow loading web fonts from your own domain
                fontSrc: ["'self'"],
                // Plugins: Completely block legacy plugins like <object>, <embed>, and <applet> (e.g., Flash)
                objectSrc: ["'none'"],
                // Embedding: Prevent any site (including your own) from putting your pages inside an <iframe>
                frameAncestors: ["'none'"],
                // Base URL: Restrict the HTML <base> tag to your own domain to prevent URL hijacking
                baseUri: ["'self'"],
                // Forms: Only allow HTML forms to submit data to your own domain
                formAction: ["'self'"],
                // HTTPS Upgrade: Automatically rewrite any insecure HTTP URLs on the page to HTTPS
                upgradeInsecureRequests: [],
            },
        },
        // Clickjacking protection (older browsers): Completely block your site from being rendered in an <iframe>
        xFrameOptions: { action: 'deny' },
        // Privacy: Never send the "Referer" header when users click links to external sites (prevents leaking sensitive URLs)
        referrerPolicy: { policy: 'no-referrer' },
        // HSTS: Force browsers to always connect via HTTPS instead of HTTP
        strictTransportSecurity: {
            maxAge: 63072000, // Remember to enforce HTTPS for 2 years (in seconds)
            includeSubDomains: true, // Apply this HTTPS rule to all subdomains as well
            preload: true, // Allow your domain to be included in browser HSTS preload lists
        },
    })
);
app.use(globalLimiter); // Apply global rate limiter to all routes
app.use(authLimiter); // Apply stricter rate limiter to auth routes
app.use("/api/auth", authRoute); // Apply stricter rate limiter to auth routes

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
