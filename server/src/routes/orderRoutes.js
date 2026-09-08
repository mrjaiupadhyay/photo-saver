import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getRecommendations,
  updateOrderStatus
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getMyOrders);
router.get("/recommendations", getRecommendations);
router.post("/", createOrder);
router.patch("/:id/status", adminOnly, updateOrderStatus);

export default router;
