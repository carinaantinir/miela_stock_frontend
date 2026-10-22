
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function CategoryGallery({
  categories,
  onCategorySelect,
  onShowAll,
}) {
  const [selected, setSelected] = useState(null);
  const [position, setPosition] = useState(0);

  const move = (direction) => {
    setPosition((current) =>
      (current + direction + categories.length) % categories.length
    );
  };

  const orderedCategories = [
    ...categories.slice(position),
    ...categories.slice(0, position),
  ];

  const goToProducts = () => {
    setSelected(null);

    requestAnimationFrame(() => {
      document
        .getElementById("inventario-miela")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };

  const handleCategoryClick = (category) => {
    setSelected(category);
    onCategorySelect(category.name);
  };

  const handleShowAll = () => {
    onShowAll();
    goToProducts();
  };

  return (
    <section className="mx-auto mt-10 max-w-5xl">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
            Universo Miela
          </p>

          <h2 className="mt-2 font-serif text-2xl font-bold text-rose-800">
            Nuestras categorías
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Nuestra colección inspirada en la hora del té.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Categoría anterior"
            className="rounded-full border border-rose-200 bg-white p-3 text-rose-700 shadow-sm hover:bg-rose-100"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Categoría siguiente"
            className="rounded-full border border-rose-200 bg-white p-3 text-rose-700 shadow-sm hover:bg-rose-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {orderedCategories.map((category) => (
          <button
            key={category.name}
            type="button"
            onClick={() => handleCategoryClick(category)}
            className="group w-40 shrink-0 overflow-hidden rounded-[28px] border border-rose-200 bg-gradient-to-br from-white to-rose-100 p-2 text-left shadow-[0_8px_24px_rgba(244,114,182,0.15)] transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(244,114,182,0.25)] sm:w-48"
          >
            <img
              src={category.image}
              alt={category.name}
              className="h-32 w-full rounded-[22px] object-cover sm:h-36"
            />

            <span className="block px-2 py-3 font-serif text-lg font-semibold text-rose-800">
              {category.name}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleShowAll}
        className="mt-3 rounded-full border border-rose-200 bg-white px-5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
      >
        Ver todos los productos
      </button>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ampliada de ${selected.name}`}
        >
          <div className="relative w-full max-w-lg rounded-[32px] bg-rose-50 p-4 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Cerrar imagen"
              className="absolute right-6 top-6 rounded-full bg-white p-2 text-rose-800 shadow-md"
            >
              <X size={20} />
            </button>

            <img
              src={selected.image}
              alt={selected.name}
              className="max-h-[65vh] w-full rounded-[24px] object-contain"
            />

            <h3 className="mt-4 text-center font-serif text-2xl font-bold text-rose-800">
              {selected.name}
            </h3>

            <button
              type="button"
              onClick={goToProducts}
              className="mt-4 w-full rounded-full bg-rose-500 px-5 py-3 font-semibold text-white hover:bg-rose-600"
            >
              Ver productos de {selected.name}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default CategoryGallery;
