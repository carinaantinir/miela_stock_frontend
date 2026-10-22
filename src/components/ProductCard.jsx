
import { Pencil, Trash2, Package } from "lucide-react";
import Button from "./Button.jsx";

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

function ProductCard({ product, onEdit, onDelete, busy }) {
  return (
    <article className="group relative overflow-hidden rounded-[32px] border border-white/80 bg-white/55 p-6 shadow-[0_8px_32px_rgba(190,100,140,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:bg-white/70 hover:shadow-[0_16px_40px_rgba(190,100,140,0.20)]">
      <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/60 via-transparent to-rose-200/25" />

      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-rose-100/80 shadow-sm">
            <Package size={28} className="text-rose-600" />
          </div>

          <span className="rounded-full border border-white/80 bg-rose-100/80 px-3 py-1 text-xs font-semibold text-rose-800">
            {product.category}
          </span>
        </div>

        <h3 className="mb-1 text-xl font-bold text-rose-900">
          {product.name}
        </h3>

        <p className="mb-3 text-2xl font-bold text-rose-700">
          {money.format(Number(product.price))}
        </p>

        <div className="mb-5 flex items-center justify-between rounded-xl border border-white/70 bg-rose-100/70 px-4 py-3 backdrop-blur-sm">
          <span className="text-sm font-medium text-rose-900">
            Unidades disponibles
          </span>

          <strong className="text-lg text-rose-900">
            {product.stock}
          </strong>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onEdit(product)}
            disabled={busy}
            className="flex items-center gap-2"
          >
            <Pencil size={16} />
            Editar
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={() => onDelete(product._id)}
            disabled={busy}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Eliminar
          </Button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
