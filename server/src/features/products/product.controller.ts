import {
  Request,
  Response,
  NextFunction,
} from "express";

import { ProductService } from "./product.service.js";

export class ProductController {
  constructor(
    private readonly productService = new ProductService()
  ) {}

  async getAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const status =
      req.query.status === "ACTIVE" ||
      req.query.status === "INACTIVE"
        ? req.query.status
        : undefined;

    const products =
      await this.productService.getAllProducts(
        status
      );

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      const product =
        await this.productService.getProductById(id);

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const product =
        await this.productService.createProduct(
          req.body
        );

      res.status(201).json({
        success: true,
        message: "Product created successfully.",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      const product =
        await this.productService.updateProduct(
          id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      await this.productService.deactivateProduct(id);

      res.status(200).json({
        success: true,
        message: "Product deactivated successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}