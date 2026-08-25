import { authService } from "./auth.service.js";
export class AuthController {
    async login(req, res, next) {
        try {
            const result = await authService.login(req.body);
            res.status(200).json({
                success: true,
                message: "Login successful.",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
export const authController = new AuthController();
