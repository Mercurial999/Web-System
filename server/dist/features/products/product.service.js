import { ProductRepository } from "./product.repository.js";
import { AppError } from "../../shared/errors/index.js";
export class ProductService {
    productRepository;
    constructor(productRepository = new ProductRepository()) {
        this.productRepository = productRepository;
    }
    async getAllProducts(status) {
        return this.productRepository.findAll(status);
    }
    async getProductById(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new AppError("Product not found.", 404);
        }
        return product;
    }
    async createProduct(data) {
        const existingProduct = await this.productRepository.findByName(data.name);
        if (existingProduct) {
            throw new AppError("Product name already exists.", 409);
        }
        return this.productRepository.create(data);
    }
    async updateProduct(id, data) {
        await this.getProductById(id);
        if (data.name) {
            const existingProduct = await this.productRepository.findByName(data.name);
            if (existingProduct && existingProduct.id !== id) {
                throw new AppError("Product name already exists.", 409);
            }
        }
        return this.productRepository.update(id, data);
    }
    async deactivateProduct(id) {
        const product = await this.getProductById(id);
        if (product.status === "INACTIVE") {
            throw new AppError("Product is already inactive.", 409);
        }
        return this.productRepository.deactivate(id);
    }
}
