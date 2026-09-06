import { NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { customerRepository } from "./customer.repository.js";

export class CustomerService {
  private customerRepository = customerRepository;

  private validateId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError("Invalid customer ID");
    }
  }

  async getCustomers() {
    return this.customerRepository.findAll();
  }

  async createCustomer(data: {
    name: string;
    address: string;
    contactPerson?: string;
    phone?: string;
  }) {
    if (!data.name.trim()) {
      throw new ValidationError("Customer name is required");
    }

    if (!data.address.trim()) {
      throw new ValidationError("Customer address is required");
    }

    return this.customerRepository.create({
      ...data,
      name: data.name.trim(),
      address: data.address.trim(),
    });
  }

  async getCustomerById(id: number) {
    this.validateId(id);

    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    return customer;
  }

  async updateCustomer(
    id: number,
    data: {
      name?: string;
      address?: string;
      contactPerson?: string;
      phone?: string;
    },
  ) {
    this.validateId(id);

    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    if (data.name !== undefined && !data.name.trim()) {
      throw new ValidationError("Customer name cannot be empty");
    }

    if (data.address !== undefined && !data.address.trim()) {
      throw new ValidationError("Customer address cannot be empty");
    }

    return this.customerRepository.update(id, {
      ...data,
      ...(data.name !== undefined && {
        name: data.name.trim(),
      }),
      ...(data.address !== undefined && {
        address: data.address.trim(),
      }),
    });
  }

  async deactivateCustomer(id: number) {
    this.validateId(id);

    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    if (customer.status === "INACTIVE") {
      throw new ValidationError("Customer is already inactive");
    }

    return this.customerRepository.deactivate(id);
  }
}

export const customerService = new CustomerService();