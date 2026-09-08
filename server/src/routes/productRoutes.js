import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  uploadProductImage,
  updateProduct
} from "../controllers/productController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, createProduct);
router.post("/upload", protect, adminOnly, uploadProductImage);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
