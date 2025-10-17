// src/admin/UsersList.jsx
import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../lib/xanoEndpoints";

export default function UsersList() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load(page = 1) {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers({ search, page, limit: meta.limit });
      const items = Array.isArray(data) ? data : data.items || [];
      const total = Array.isArray(data) ? items.length : data.total ?? items.length;
      setRows(items);
      setMeta((m) => ({ ...m, page, total }));
    } catch (e) {
      setError("Error cargando usuarios");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(1); }, []); // carga inicial

  return (
    <section>
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Buscar por nombre o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-dark" onClick={() => load(1)}>Buscar</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Activo</th>
                <th style={{width:160}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.isActive ? "Sí" : "No"}</td>
                  <td className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary"
                      onClick={async () => {
                        const nextRole = u.role === "admin" ? "user" : "admin";
                        await updateUser(u.id, { role: nextRole });
                        load(meta.page);
                      }}>
                      Cambiar rol
                    </button>
                    <button className="btn btn-sm btn-outline-danger"
                      onClick={async () => {
                        if (!confirm("¿Eliminar usuario?")) return;
                        await deleteUser(u.id);
                        load(meta.page);
                      }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="text-center py-4">Sin usuarios</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>Total: {meta.total}</span>
        <div className="btn-group">
          <button className="btn btn-outline-secondary" disabled={meta.page<=1} onClick={()=>load(meta.page-1)}>Anterior</button>
          <button className="btn btn-outline-secondary" disabled={rows.length<meta.limit} onClick={()=>load(meta.page+1)}>Siguiente</button>
        </div>
      </div>
    </section>
  );
}
