import { apiRequest } from "../lib/api";
import type { Customer, CustomerInput } from "../types/customer.types";

interface CustomerResponse {
  success: boolean;
  data: Customer[];
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await apiRequest<CustomerResponse>("/customers");
  return response.data;
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  const response = await apiRequest<{ data: Customer }>("/customers", {
    method: "POST",
    body: input,
  });
  return response.data;
}

export async function updateCustomer(
  id: number,
  input: Partial<CustomerInput>,
): Promise<Customer> {
  const response = await apiRequest<{ data: Customer }>(`/customers/${id}`, {
    method: "PATCH",
    body: input,
  });
  return response.data;
}

export async function deactivateCustomer(id: number): Promise<Customer> {
  const response = await apiRequest<{ data: Customer }>(
    `/customers/${id}/deactivate`,
    { method: "PATCH" },
  );
  return response.data;
}
