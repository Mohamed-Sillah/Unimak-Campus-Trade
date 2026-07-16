import express from "express";
import multer from "multer";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

// ... existing imports

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getProducts);
router.get("/:id", getProductById);

// FIX: Make the main POST route handle the upload
router.post("/", 
  authMiddleware, 
  adminMiddleware, 
  upload.single("image"), // Add this here
  (req, res, next) => {
    // Parse price if it comes as a string from FormData
    if (req.body.price) {
      req.body.price = parseFloat(req.body.price);
    }
    next();
  }, 
  createProduct
);

// DELETE the old /upload route to avoid confusion
// router.post("/upload", ...) 

router.patch("/:id", 
  authMiddleware, 
  adminMiddleware, 
  upload.single("image"), 
  (req, res, next) => {
    // Parse price if it comes as a string from FormData
    if (req.body.price) {
      req.body.price = parseFloat(req.body.price);
    }
    next();
  },
  updateProduct
);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;