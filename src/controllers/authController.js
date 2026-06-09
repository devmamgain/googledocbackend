const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } =
            req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "All fields are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
            });
        }

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message:
                    "Email already exists",
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500);
        throw error;
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } =
            req.body;

        const user =
            await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid credentials",
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid credentials",
            });
        }

        res.json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500);
        throw error;
    }
};

const getMe = async (req, res) => {
    res.json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};