export interface Role {
	id: number;
	name: string;
	description?: string | null;
}

export interface RoleInput {
	name: string;
	description?: string;
}
