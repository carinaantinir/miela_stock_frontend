
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import Button from "./Button.jsx";
import { apiRequest } from "../lib/api.js";

function AdminRecords({
  title,
  description,
  storageKey,
  endpoint,
  fields,
  readOnly = false,
}) {
  const emptyForm = Object.fromEntries(
    fields.map((field) => [field.name, ""])
  );

  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [localRecords, setLocalRecords] = useState([]);

  const loadRecords = async () => {
    const data = await apiRequest(endpoint);

    if (!Array.isArray(data)) {
      throw new Error(
        "La API no devolvió una lista de registros"
      );
    }

    setRecords(data);
    return data;
  };

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      if (!readOnly) {
        try {
          const saved = localStorage.getItem(storageKey);
          const parsed = saved ? JSON.parse(saved) : [];

          if (active && Array.isArray(parsed)) {
            setLocalRecords(parsed);
          }
        } catch {
          if (active) {
            setLocalRecords([]);
          }
        }
      }

      try {
        const data = await apiRequest(endpoint);

        if (active) {
          if (!Array.isArray(data)) {
            throw new Error(
              "La API no devolvió una lista"
            );
          }

          setRecords(data);
          setError("");
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      active = false;
    };
  }, [endpoint, storageKey, readOnly]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (readOnly) return;

    setSaving(true);
    setMessage("");
    setError("");

    const data = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [
        key,
        value.trim(),
      ])
    );

    const isEditing = editingId !== null;

    try {
      await apiRequest(
        isEditing
          ? `${endpoint}/${editingId}`
          : endpoint,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      await loadRecords();
      handleCancel();

      setMessage(
        isEditing
          ? "Registro actualizado correctamente"
          : "Registro agregado correctamente"
      );
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    if (readOnly) return;

    setEditingId(record._id);
    setMessage("");
    setError("");

    setForm(
      Object.fromEntries(
        fields.map((field) => [
          field.name,
          record[field.name] || "",
        ])
      )
    );
  };

  const handleDelete = async (id) => {
    if (readOnly) return;

    if (!window.confirm("¿Eliminar este registro?")) {
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await apiRequest(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      await loadRecords();

      if (editingId === id) {
        handleCancel();
      }

      setMessage(
        "Registro eliminado correctamente"
      );
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImport = async () => {
    if (readOnly) return;

    if (
      !window.confirm(
        "¿Importar a MongoDB los registros guardados en este navegador?"
      )
    ) {
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    let imported = 0;

    try {
      let existing = await apiRequest(endpoint);

      for (const record of localRecords) {
        const data = Object.fromEntries(
          fields.map((field) => [
            field.name,
            String(record[field.name] || "").trim(),
          ])
        );

        const alreadyExists = existing.some(
          (item) =>
            fields.every(
              (field) =>
                String(item[field.name] || "")
                  .trim()
                  .toLowerCase() ===
                data[field.name].toLowerCase()
            )
        );

        if (alreadyExists) {
          continue;
        }

        const created = await apiRequest(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        existing = [...existing, created.record];
        imported += 1;
      }

      await loadRecords();

      setMessage(
        `${imported} registro(s) importado(s) a MongoDB. Los originales siguen guardados en este navegador.`
      );
    } catch (caughtError) {
      await loadRecords().catch(() => {});

      setError(
        `Se importaron ${imported} registro(s) antes de interrumpirse el proceso. ${caughtError.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  const inputStyles =
    "w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-stone-700 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200";

  return (
    <section className="rounded-[32px] border border-rose-200 bg-white p-5 shadow-lg shadow-rose-200/30 sm:p-7">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-rose-800">
          {title}
        </h2>

        <p className="mt-2 text-sm text-stone-500">
          {description}
        </p>

        <p className="mt-2 text-xs text-rose-600">
          Datos guardados en MongoDB.
        </p>

        {!readOnly && localRecords.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleImport}
              disabled={saving}
            >
              Importar registros anteriores
            </Button>

            <span className="text-xs text-stone-500">
              {localRecords.length} registro(s) en este navegador
            </span>
          </div>
        )}
      </div>

      {message && (
        <p
          role="status"
          className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          {message}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {!readOnly && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid gap-4 border-b border-rose-100 pb-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <label
                key={field.name}
                className="grid gap-2 text-sm font-medium text-stone-700"
              >
                {field.label}

                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  required={field.required !== false}
                  disabled={saving}
                  className={inputStyles}
                />
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Guardando..."
                : editingId !== null
                  ? "Guardar cambios"
                  : "Agregar registro"}
            </Button>

            {editingId !== null && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      )}

      <h3 className="mb-4 text-lg font-semibold text-rose-800">
        Registros ({records.length})
      </h3>

      {loading ? (
        <p className="text-stone-500">
          Cargando registros...
        </p>
      ) : records.length === 0 ? (
        <p className="rounded-2xl bg-rose-50 p-6 text-center text-stone-500">
          Todavía no hay registros.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {records.map((record) => (
            <article
              key={record._id}
              className="rounded-[24px] border border-rose-200 bg-rose-50 p-5"
            >
              {fields.map((field) => (
                <p
                  key={field.name}
                  className="mb-2 break-words text-sm text-stone-700"
                >
                  <span className="font-semibold">
                    {field.label}:
                  </span>{" "}
                  {record[field.name] || "Sin dato"}
                </p>
              ))}

              {!readOnly && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={saving}
                    onClick={() => handleEdit(record)}
                  >
                    <Pencil size={16} />
                    Editar
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    disabled={saving}
                    onClick={() =>
                      handleDelete(record._id)
                    }
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </Button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminRecords;
