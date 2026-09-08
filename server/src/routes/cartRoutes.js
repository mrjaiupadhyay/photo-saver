import { Router } from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getCart);
router.post("/", addToCart);
router.patch("/", updateCartQuantity);
router.delete("/:productId", removeFromCart);
router.delete("/", clearCart);

export default router;
