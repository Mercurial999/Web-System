import { useEffect, useState } from "react";
import { createRole, getRoles } from "../../services/roleService";
import type { Role } from "../../types/role.types";

function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  async function load(): Promise<void> { try { setRoles(await getRoles()); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to load roles."); } }
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);
  async function submit(): Promise<void> { try { await createRole({ name, description }); setName(""); setDescription(""); await load(); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to create role."); } }
  return <section className="space-y-6"><div><p className="text-sm font-semibold uppercase tracking-widest text-amber-700">Administration</p><h2 className="text-3xl font-bold text-stone-800">Roles</h2></div>{error && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="grid gap-6 lg:grid-cols-[1fr_320px]"><div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">{roles.map((role) => <div className="border-b border-stone-100 py-3" key={role.id}><strong>{role.name}</strong><p className="text-sm text-stone-500">{role.description || "No description"}</p></div>)}</div><div className="space-y-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm"><h3 className="font-semibold">Add role</h3><input className="w-full rounded border border-stone-300 px-3 py-2" placeholder="Role name" value={name} onChange={(event) => setName(event.target.value)} /><input className="w-full rounded border border-stone-300 px-3 py-2" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} /><button className="rounded bg-amber-700 px-4 py-2 font-semibold text-white" onClick={() => void submit()}>Save role</button></div></div></section>;
}

export default RolesPage;