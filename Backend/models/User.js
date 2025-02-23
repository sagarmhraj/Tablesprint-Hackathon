import bcrypt from 'bcryptjs';
import validator from 'validator';
import { db } from '../config/db.js';

// Function to validate email
function isEmailValid(email) {
    return validator.isEmail(email);
}

// Function to create a new user
export async function createUser({ name, email, password, confirmPassword }) {
    if (!name || !email || !password || !confirmPassword) {
        throw new Error("All fields are required!");
    }

    if (name.length < 4) {
        throw new Error("Name should have at least 4 characters!");
    }

    if (!isEmailValid(email)) {
        throw new Error("Invalid email! Please enter a valid email!");
    }

    if (password.length < 8) {
        throw new Error("Password should have at least 8 characters");
    }

    if (password !== confirmPassword) {
        throw new Error("Password and confirm password don't match!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await db();

    const [result] = await connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );

    return result.insertId;
}

// Function to verify password
export async function verifyPassword(inputPassword, storedPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
}

// Function to update user password
export async function updateUserPassword(userId, newPassword) {
    const connection = await db();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await connection.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, userId]
    );
}
