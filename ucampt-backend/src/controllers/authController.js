import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../config/database.js";
import { JWT_SECRET } from "../config/env.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const db = getDb();

    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Enforce .edu email for any ADMIN account (server-side check)
    if (user.role === 'ADMIN' && !user.email.toLowerCase().endsWith('.edu')) {
      return res.status(401).json({ message: 'Admin login requires a .edu university email' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    // Require university .edu emails for registration
    if (!email.toLowerCase().endsWith('.edu')) {
      return res.status(400).json({ message: 'Registration requires a .edu university email' });
    }
    const db = getDb();

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, name, "USER"]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
