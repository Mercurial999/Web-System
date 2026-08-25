import { AppError } from "../shared/errors/index.js";
export function errorMiddleware(error, req, res, next) {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
        return;
    }
    console.error(error);
    res.status(500).json({
        success: false,
        message: "Internal server error.",
    });
}
