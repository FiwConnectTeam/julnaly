const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function signToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
    });
}

const authController = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ error: "name, email and password are required" });
            }
            if (password.length < 8) {
                return res.status(400).json({ error: "Password must be at least 8 characters" });
            }

            const existing = await User.findByEmail(email);
            if (existing) {
                return res.status(409).json({ error: "Email already registered" });
            }

            const user = await User.create({ name, email, password });
            const token = signToken(user);

            res.status(201).json({ user, token });
        } catch (err) {
            console.error("register error:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "email and password are required" });
            }

            const user = await User.findByEmail(email);
            if (!user || !(await User.verifyPassword(password, user.password))) {
                // same message for both cases — don't reveal whether the email exists
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = signToken(user);
            res.json({
                user: { id: user.id, name: user.name, email: user.email },
                token,
            });
        } catch (err) {
            console.error("login error:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async me(req, res) {
        // req.user is set by the auth middleware
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ user });
    },
};

module.exports = authController;
