import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { db } from '../config/db.js';

const auth = asyncHandler(async (req, res, next) => {
  try {
    const testToken = req.headers.authorization;
    let token;
    if (testToken && testToken.startsWith("Bearer")) {
      token = testToken.split(" ")[1];
    } else {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const connection = await db();
    const [users] = await connection.query('SELECT * FROM users WHERE id = ?', [decodedToken.id]);

    if (users.length === 0) {
      return res.status(404).json({ message: "No user found, please register" });
    }

    req.userId = users[0].id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});

export default auth;