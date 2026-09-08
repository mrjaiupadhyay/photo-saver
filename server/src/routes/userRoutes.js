import { Router } from "express";
import { updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.patch("/profile", updateProfile);

export default router;
