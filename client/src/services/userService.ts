import { apiRequest } from "../lib/api";
import type { User, UserInput } from "../types/user.types";

export async function getUsers(): Promise<User[]> {
	const response = await apiRequest<{ data: User[] }>("/users");
	return response.data;
}

export async function createUser(input: UserInput): Promise<User> {
	const response = await apiRequest<{ data: User }>("/users", { method: "POST", body: input });
	return response.data;
}

export async function updateUser(id: number, input: Partial<UserInput> & { status?: "ACTIVE" | "INACTIVE" }): Promise<User> {
	const response = await apiRequest<{ data: User }>(`/users/${id}`, { method: "PUT", body: input });
	return response.data;
}
