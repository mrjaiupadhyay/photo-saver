import { User } from "../models/User.js";

export const updateProfile = async (req, res) => {
  const { name, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...(name ? { name } : {}), ...(address !== undefined ? { address } : {}) },
    { new: true }
  ).select("-password");
  res.json(user);
};
