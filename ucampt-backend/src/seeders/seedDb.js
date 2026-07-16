import bcrypt from "bcryptjs";
import { getDb } from "../config/database.js";
import { fileURLToPath } from "url";

export async function seedDatabase() {
  try {
    const db = getDb();

    // Check if admin already exists
    const adminExists = await db.get(
      "SELECT * FROM users WHERE role = ?",
      ["ADMIN"]
    );

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("sillah001", 10);

      await db.run(
        "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
        ["sillah@university.edu", hashedPassword, "Admin User", "ADMIN"]
      );

      console.log("✓ Admin user created");
      console.log("  Email: sillah@university.edu");
      console.log("  Password: sillah001");
    }

    // Check if sample products exist
    const productCount = await db.get("SELECT COUNT(*) as count FROM products");

    if (productCount.count === 0) {
      await db.run(
        `INSERT INTO products 
         (title, description, price, category, image, studentName, studentContact, payoutMethod, privateNotes, createdBy)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Introduction to Computer Science Textbook",
          "Used textbook in excellent condition. Great for freshmen.",
          45.99,
          "Books",
          "https://via.placeholder.com/200?text=CS+Book",
          "John Doe",
          "john@university.edu",
          "Venmo",
          "Payment after pickup",
          1,
        ]
      );

      await db.run(
        `INSERT INTO products 
         (title, description, price, category, image, studentName, studentContact, payoutMethod, privateNotes, createdBy)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Laptop Stand - Aluminum",
          "Portable laptop stand, perfect for studying anywhere on campus.",
          35.0,
          "Electronics",
          "https://via.placeholder.com/200?text=Laptop+Stand",
          "Jane Smith",
          "jane@university.edu",
          "Bank Transfer",
          "Available for pickup in library",
          1,
        ]
      );

      await db.run(
        `INSERT INTO products 
         (title, description, price, category, image, studentName, studentContact, payoutMethod, privateNotes, createdBy)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Calculus Problem Set Solutions",
          "Complete solutions for Math 201 problem sets from Fall 2024.",
          15.0,
          "Study Materials",
          "https://via.placeholder.com/200?text=Math+Solutions",
          "Ahmed Hassan",
          "ahmed@university.edu",
          "Cash",
          "Digital copy via email",
          1,
        ]
      );

      console.log("✓ Sample products created");
    }

    console.log("Database seeding completed!");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

// If this module is run directly (`node src/seeders/seedDb.js`), execute the seeder
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  await seedDatabase();
}
