import { userService } from "./user.service.js";
export class UserController {
    async createUser(req, res, next) {
        try {
            const data = req.body;
            const user = await userService.createUser(data);
            res.status(201).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json({
                success: true,
                data: users,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const user = await userService.getUserById(id);
            res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteUser(req, res, next) {
        try {
            const id = Number(req.params.id);
            await userService.deleteUser(id);
            res.status(200).json({
                success: true,
                message: "User deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateUser(req, res, next) {
        try {
            const id = Number(req.params.id);
            const data = req.body;
            const user = await userService.updateUser(id, data);
            res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
export const userController = new UserController();
