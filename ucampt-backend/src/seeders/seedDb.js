import bcrypt from "bcryptjs";
import { getDb } from "../config/database.js";
import { fileURLToPath } from "url";

export async function seedDatabase() {
  try {
    const db = getDb();
    const adminEmail = "sillah@university.edu";
    const adminName = "Admin User";
    const adminPassword = "sillah001";

    const existingAdmin = await db.get(
      "SELECT * FROM users WHERE role = ? OR email = ?",
      ["ADMIN", adminEmail]
    );

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await db.run(
        "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
        [adminEmail, hashedPassword, adminName, "ADMIN"]
      );
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.run(
        "UPDATE users SET email = ?, name = ?, password = ? WHERE id = ?",
        [adminEmail, adminName, hashedPassword, existingAdmin.id]
      );
    }

    console.log("✓ Admin user ensured");
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);

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
