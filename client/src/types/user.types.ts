export interface User {
	id: number;
	roleId: number;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string | null;
	status: "ACTIVE" | "INACTIVE";
	role?: { name: string };
}

export interface UserInput {
	roleId: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone?: string;
}
