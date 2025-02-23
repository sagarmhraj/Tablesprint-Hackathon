import { createUser, verifyPassword, updateUserPassword } from "../models/User.js";
import asyncHandler from "express-async-handler";
import { genToken } from "../utils/genToken.js";
import { db } from '../config/db.js';
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { sendEmail } from "../utils/sendEmail.js";  // Custom email function

// Register a new user
const register = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    const connection = await db();

    const [existingUser] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    if (existingUser.length > 0) {
        return res.status(409).json({
            status: "failed",
            message: "User exists already"
        }); // ✅ Fixed: Correct response instead of throwing an error
    }

    const userId = await createUser({ name, email, password, confirmPassword });
    const token = await genToken(userId);

    const [newUser] = await connection.query(
        'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
        [userId]
    );

    res.status(201).json({
        status: "success",
        data: newUser[0],
        token
    });
});

// User login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const connection = await db();

    const [existingUser] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    if (existingUser.length === 0) {
        return res.status(404).json({ message: "User email is not registered. Please sign up." });
    }

    const user = existingUser[0];
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await genToken(user.id);

    const { password: pwd, ...userData } = user;

    res.status(200).json({
        status: "Success!",
        data: userData,
        token
    });
});

// Forgot Password - Generates a reset token and sends an email
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const connection = await db();

    // Check if user exists
    const [user] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiryTime = new Date(Date.now() + 3600000) // 1 hour expiry
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

    // Store the token in the database
    await connection.query(
        "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
        [resetToken, expiryTime, email]
    );

    // Create reset link

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`;

    // Send email with Nodemailer
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL, // Email from .env
            pass: process.env.EMAIL_PASSWORD, // App password from .env
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset Request",
        html: `<p>Click the link below to reset your password:</p>
               <a href="${resetLink}">${resetLink}</a>
               <p>This link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to your email" });
});

// Reset Password - Verifies token and updates password
const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    console.log("Received Token:", token); // ✅ Logs the token for debugging

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const connection = await db();

    const [user] = await connection.query(
        "SELECT * FROM users WHERE reset_token = ?",
        [token]
    );

    if (user.length === 0) {
        return res.status(400).json({ message: "Invalid token" });
    }

    console.log("User Found:", user[0]); // ✅ Logs user data for debugging

    const resetTokenExpiry = new Date(user[0].reset_token_expiry);
    const currentTime = new Date();

    if (resetTokenExpiry <= currentTime) {
        return res.status(400).json({ message: "Token has expired. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await connection.query(
        "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
        [hashedPassword, user[0].id]
    );

    res.json({
        message: "Password reset successful! You can now log in.",
        token: token // ✅ Sending back token for verification
    });
});


// Update Password - Allows logged-in users to change their password
const updatePassword = asyncHandler(async (req, res) => {
    const { userId, currentPassword, newPassword, confirmPassword } = req.body;

    if (!userId || !currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const connection = await db();

    const [user] = await connection.query("SELECT * FROM users WHERE id = ?", [userId]);

    if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await verifyPassword(currentPassword, user[0].password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect current password" });
    }

    await updateUserPassword(userId, newPassword);

    res.json({ message: "Password updated successfully!" });
});

export { register, login, forgotPassword, resetPassword, updatePassword };
