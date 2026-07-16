import { getDb } from "../config/database.js";
import { saveUploadedFile } from "../utils/fileUpload.js";
import { broadcastNotification } from "./notificationController.js";

export async function getProducts(req, res) {
  try {
    const db = getDb();
    const products = await db.all("SELECT * FROM products");
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getProductById(req, res) {
  try {
    const db = getDb();
    const product = await db.get("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createProduct(req, res) {
  try {
    // 1. Destructure with defaults to prevent 'undefined' values
    const {
      title = "",
      description = "",
      price = 0,
      category = "",
      studentName = "",
      studentContact = "",
      payoutMethod = "",
      privateNotes = "",
    } = req.body;

    const db = getDb();

    // 2. Handle image upload (saveUploadedFile now async and may upload to Cloudinary)
    let imageUrl = null;
    if (req.file) {
      imageUrl = await saveUploadedFile(req.file);
    }

    // 3. Log for debugging - Check your terminal to see if title is blank here
    console.log("DB Insert - Title:", title); 

    const result = await db.run(
      `INSERT INTO products 
       (title, description, price, category, image, studentName, studentContact, payoutMethod, privateNotes, createdBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,            // If this is undefined, SQLite throws the NOT NULL error
        description,
        parseFloat(price) || 0, // Ensure it's a number
        category,
        imageUrl,         // This can be null if your DB allows it
        studentName,
        studentContact,
        payoutMethod,
        privateNotes,
        req.user.id,      // Ensure authMiddleware is working
      ]
    );

    res.status(201).json({
      message: "Product created successfully",
      id: result.lastID,
    });

    // Broadcast notification to all users about the new listing
    await broadcastNotification(
 
 
 
 
      "NEW_LISTING",
      `New listing: "${title}" (Le ${price})`
    );
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const db = getDb();
    const product = await db.get("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.createdBy !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { 
      title, 
      description, 
      price, 
      category,
      studentName,
      studentContact,
      payoutMethod,
      privateNotes
    } = req.body;

    console.log("Update request received:", { title, description, price, category, studentName, studentContact, payoutMethod, privateNotes });

    // Handle image upload if provided (async)
    let imageUrl = product.image;
    if (req.file) {
      imageUrl = await saveUploadedFile(req.file);
    }

    await db.run(
      `UPDATE products SET 
       title = ?, 
       description = ?, 
       price = ?, 
       category = ?, 
       image = ?,
       studentName = ?,
       studentContact = ?,
       payoutMethod = ?,
       privateNotes = ?
       WHERE id = ?`,
      [title, description, price, category, imageUrl, studentName, studentContact, payoutMethod, privateNotes, req.params.id]
    );

    console.log("Product updated successfully");
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const db = getDb();
    const product = await db.get("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.createdBy !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await db.run("DELETE FROM products WHERE id = ?", [req.params.id]);

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
