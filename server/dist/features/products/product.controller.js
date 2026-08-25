import { ProductService } from "./product.service.js";
export class ProductController {
    productService;
    constructor(productService = new ProductService()) {
        this.productService = productService;
    }
    async getAll(req, res, next) {
        try {
            const products = await this.productService.getAllProducts();
            res.status(200).json({
                success: true,
                data: products,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const product = await this.productService.getProductById(id);
            res.status(200).json({
                success: true,
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json({
                success: true,
                message: "Product created successfully.",
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const product = await this.productService.updateProduct(id, req.body);
            res.status(200).json({
                success: true,
                message: "Product updated successfully.",
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const id = Number(req.params.id);
            await this.productService.deactivateProduct(id);
            res.status(200).json({
                success: true,
                message: "Product deactivated successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
