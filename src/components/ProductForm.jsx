
import Button from "./Button.jsx";



function ProductForm({
    form,
    onChange,
    onSubmit,
    onCancel,
    editing,
    saving,
}) {
    return (
        <section
            className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm"
            aria-labelledby="form-title"
        >
            <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-rose-400">
                Gestión de inventario
                </p>

                <h2
                    id="form-title"
                    className="mt-2 text-2xl font-bold text-rose-500"
            >
                {editing ? "Editar producto" : "Agregar producto"}
            </h2>

            <p className="mt-2 text-sm text-stone-500">
                Administrá los productos de Miela Stock.
            </p>
        </div>

    <form
        onSubmit={onSubmit}
        className="grid gap-5"
    >
        <label className="grid gap-2 text-sm font-medium text-stone-700">
            Nombre del producto

            <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Ej. Té de frutos rojos"
                    required
                    className="w-full rounded-[24px] border border-rose-200 bg-white/80 px-5 py-3 text-stone-700 shadow-inner shadow-rose-100 outline-none transition-all focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
                />
            </label>

            <label className="grid gap-2 text-sm font-medium text-stone-700">
                Categoría

            <select
                name="category"
                value={form.category}
                onChange={onChange}
                required
                className="w-full rounded-[24px] border border-rose-200 bg-white/80 px-5 py-3 text-stone-700 shadow-inner shadow-rose-100 outline-none transition-all focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
            >
                <option value="Té">Té</option>
                <option value="Café">Café</option>
                <option value="Gift Card">Gift Card</option>
                <option value="Complements">Complements</option>
                </select>
            </label>

        <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-stone-700">
                Precio

                <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={onChange}
                    min="0"
                    step="any"
                    placeholder="0"
                    required
                    className="w-full rounded-[24px] border border-rose-200 bg-white/80 px-5 py-3 text-stone-700 shadow-inner shadow-rose-100 outline-none transition-all focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
                    
                />
            </label>

            <label className="grid gap-2 text-sm font-medium text-stone-700">
                    Stock

                <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={onChange}
                    min="0"
                    step="1"
                    placeholder="0"
                    required
                    className="w-full rounded-[24px] border border-rose-200 bg-white/80 px-5 py-3 text-stone-700 shadow-inner shadow-rose-100 outline-none transition-all focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
                />
            </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-3">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                >
                    {saving
                        ? "Guardando..."
                        : editing
                            ? "Guardar cambios"
                            : "Agregar producto"}
                    </Button>

                    {editing && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            Cancelar
                        </Button>
                    )}
                </div>
            </form>
        </section>
    );
}



export default ProductForm;
