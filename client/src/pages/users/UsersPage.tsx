import { useEffect, useState } from "react";
import { getRoles } from "../../services/roleService";
import { createUser, getUsers } from "../../services/userService";
import type { Role } from "../../types/role.types";
import type { User } from "../../types/user.types";

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", roleId: "" });
  const [error, setError] = useState<string | null>(null);
  async function load(): Promise<void> { try { const [userData, roleData] = await Promise.all([getUsers(), getRoles()]); setUsers(userData); setRoles(roleData); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to load users."); } }
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);
  async function submit(): Promise<void> { try { await createUser({ ...form, roleId: Number(form.roleId) }); setForm({ firstName: "", lastName: "", email: "", password: "", roleId: "" }); await load(); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to create user."); } }
  return <section className="space-y-6"><div><p className="text-sm font-semibold uppercase tracking-widest text-amber-700">Administration</p><h2 className="text-3xl font-bold text-stone-800">Users</h2></div>{error && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="grid gap-6 lg:grid-cols-[1fr_340px]"><div className="overflow-x-auto rounded-lg border border-stone-200 bg-white p-5 shadow-sm"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-stone-200 text-stone-500"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Status</th></tr></thead><tbody>{users.map((user) => <tr className="border-b border-stone-100" key={user.id}><td className="p-3">{user.firstName} {user.lastName}</td><td className="p-3">{user.email}</td><td className="p-3">{user.role?.name ?? user.roleId}</td><td className="p-3">{user.status}</td></tr>)}</tbody></table></div><div className="space-y-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm"><h3 className="font-semibold">Add user</h3>{(["firstName", "lastName", "email", "password"] as const).map((field) => <input className="w-full rounded border border-stone-300 px-3 py-2" key={field} type={field === "password" ? "password" : field === "email" ? "email" : "text"} placeholder={field} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />)}<select className="w-full rounded border border-stone-300 px-3 py-2" value={form.roleId} onChange={(event) => setForm({ ...form, roleId: event.target.value })}><option value="">Select role</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select><button className="rounded bg-amber-700 px-4 py-2 font-semibold text-white" onClick={() => void submit()}>Save user</button></div></div></section>;
}

export default UsersPage;