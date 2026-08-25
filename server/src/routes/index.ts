import { Router } from "express";

import { userRoutes } from "../features/users/index.js";
import { roleRoutes } from "../features/roles/index.js";
import { authRoutes } from "../features/auth/index.js";
import { permissionRoutes } from "../features/permissions/index.js";

const router = Router();

router.use("/users", userRoutes);

router.use("/roles", roleRoutes);

router.use("/auth", authRoutes);

router.use("/permissions", permissionRoutes);

export default router;