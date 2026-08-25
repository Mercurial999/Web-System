import { env } from "./env.js";
import type { SignOptions } from "jsonwebtoken";

export const authConfig = {
  jwtSecret: env.JWT_SECRET,

  jwtExpiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],

  bcryptSaltRounds: 12,
};