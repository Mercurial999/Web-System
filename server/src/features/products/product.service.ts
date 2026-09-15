import { ProductRepository } from "./product.repository.js";
import {
  AppError,
  ValidationError,
} from "../../shared/errors/index.js";

export class ProductService {
  constructor(
    private readonly productRepository = new ProductRepository()
  ) {}

  async getAllProducts(
  status?: "ACTIVE" | "INACTIVE"
    ) {
    return this.productRepository.findAll(status);
  }

  async getProductById(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError("Invalid product ID.");
  }

  const product = await this.productRepository.findById(id);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  return product;
  
  }

  async createProduct(data: {
    name: string;
    description?: string;
    unit: string;
    price: number;
  }) {
    const existingProduct =
      await this.productRepository.findByName(data.name);

    if (existingProduct) {
      throw new AppError(
        "Product name already exists.",
        409
      );
    }

    return this.productRepository.create(data);
  }

  async updateProduct(
    id: number,
    data: {
      name?: string;
      description?: string;
      unit?: string;
      price?: number;
      status?: "ACTIVE" | "INACTIVE";
    }
  ) {
    await this.getProductById(id);

    if (data.name) {
      const existingProduct =
        await this.productRepository.findByName(data.name);

      if (existingProduct && existingProduct.id !== id) {
        throw new AppError(
          "Product name already exists.",
          409
        );
      }
    }

    return this.productRepository.update(id, data);
  }

  async deactivateProduct(id: number) {
    const product = await this.getProductById(id);

    if (product.status === "INACTIVE") {
      throw new AppError(
        "Product is already inactive.",
        409
      );
    }

    return this.productRepository.deactivate(id);
  }
}