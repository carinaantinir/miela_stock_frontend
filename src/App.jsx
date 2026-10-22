
import { useEffect, useState } from "react";

import {
  Package,
  Boxes,
  Wallet,
  Users,
  Truck,
  Search,
} from "lucide-react";

import conejito from "./assets/miela_hero_conejito.jpg";
import StatCard from "./components/StatCard.jsx";
import ProductForm from "./components/ProductForm";
import { EMPTY_PRODUCT } from "./lib/productDefaults";

import ProductCard from "./components/ProductCard.jsx";
import CategoryGallery from "./components/CategoryGallery.jsx";
import AdminRecords from "./components/AdminRecords.jsx";

import {
  apiRequest,
  setAuthToken,
  setSessionExpiredHandler,
} from "./lib/api.js";

import "./App.css";

const API_URL = "/api/products";

const images = import.meta.glob("./assets/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

const categories = [
  {
    name: "Té",
    description: "Matcha e infusiones",
    image: images["./assets/matcha.png"],
  },
  {
    name: "Café",
    description: "Café en granos",
    image: images["./assets/cafe.png"],
  },
  {
    name: "Complements",
    description: "Tazas y accesorios",
    image: images["./assets/complementos.png"],
  },
  {
    name: "Gift Card",
    description: "Tarjetas de regalo",
    image: images["./assets/giftCard.png"],
  },
].filter((category) => Boolean(category.image));

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const inputClass =
  "w-full rounded-2xl border border-rose-200/70 bg-white/65 px-4 py-3 outline-none backdrop-blur-sm transition-all duration-300 focus:border-rose-300 focus:bg-white/90 focus:ring-4 focus:ring-rose-200/40";

const buttonClass =
  "mt-2 rounded-full border border-white/60 bg-gradient-to-r from-rose-400 to-pink-500 px-5 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-rose-500 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-50";

const emptyRegisterForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function App() {
  const [section, setSection] = useState("products");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_PRODUCT });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  

  const [authUser, setAuthUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    ...emptyRegisterForm,
  });

  const [loginError, setLoginError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [registering, setRegistering] = useState(false);

  const isAdmin = authUser?.role === "admin";

  

  const loadProducts = async () => {
    setLoading(true);

    try {
      const data = await apiRequest(API_URL);

      const list = Array.isArray(data)
        ? data
        : data?.products ?? data?.data;

      if (!Array.isArray(list)) {
        throw new Error(
          "La API no devolvió una lista de productos"
        );
      }

      setProducts(list);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
    
    useEffect(() => {
      if (!authUser) return;

      const fetchProducts = async () => {
        await loadProducts();
      };

      fetchProducts();
  }, [authUser]);
  


  const handleLogin = async (event) => {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    setAuthMessage("");

    try {
      const data = await apiRequest("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      if (!data.token || !data.user) {
        throw new Error(
          "No se pudo completar el inicio de sesión"
        );
      }

      if (
        data.user.role !== "admin" &&
        data.user.role !== "user"
      ) {
        throw new Error("Rol de usuario no reconocido");
      }

      setAuthToken(data.token);
      setAuthUser(data.user);

      setLoginForm({
        email: "",
        password: "",
      });

      setMessage("");
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoggingIn(false);
    }
  };

  

  const handleRegister = async (event) => {
    event.preventDefault();

    setLoginError("");
    setAuthMessage("");

    if (
      registerForm.password !==
      registerForm.confirmPassword
    ) {
      setLoginError("Las contraseñas no coinciden");
      return;
    }

    if (registerForm.password.length < 8) {
      setLoginError(
        "La contraseña debe tener al menos 8 caracteres"
      );
      return;
    }

    setRegistering(true);

    try {
      await apiRequest("/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerForm.name.trim(),
          email: registerForm.email.trim(),
          password: registerForm.password,
        }),
      });

      const registeredEmail = registerForm.email.trim();

      setRegisterForm({
        ...emptyRegisterForm,
      });

      setLoginForm({
        email: registeredEmail,
        password: "",
      });

      setAuthMode("login");

      setAuthMessage(
        "Cuenta creada correctamente. Ya podés iniciar sesión."
      );
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setRegistering(false);
    }
  };

  const changeAuthMode = (mode) => {
    setAuthMode(mode);
    setLoginError("");
    setAuthMessage("");
  };

  

  const handleLogout = () => {
    setAuthToken(null);
    setAuthUser(null);
    setProducts([]);
    setMessage("");
    setSection("products");
    setEditingId(null);
    setForm({ ...EMPTY_PRODUCT });
    setAuthMode("login");
    setLoginError("");
    setAuthMessage("");
  };

  useEffect(() => {
    setSessionExpiredHandler(handleLogout);

    return () => {
      setSessionExpiredHandler(null);
    };
  }, []);

  

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ ...EMPTY_PRODUCT });
  };

  const handleEdit = (product) => {
    if (!isAdmin) return;

    setEditingId(product._id);

    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) return;

    setSaving(true);
    setMessage("");

    const isEditing = editingId !== null;

    const productData = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      await apiRequest(
        isEditing
          ? `${API_URL}/${editingId}`
          : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      handleCancel();
      await loadProducts();

      setMessage(
        isEditing
          ? "Producto actualizado correctamente"
          : "Producto agregado correctamente"
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;

    if (!window.confirm("¿Eliminar este producto?")) {
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      await apiRequest(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (editingId === id) {
        handleCancel();
      }

      await loadProducts();

      setMessage("Producto eliminado correctamente");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  const inventoryValue = products.reduce(
    (total, product) =>
      total +
      Number(product.price || 0) *
        Number(product.stock || 0),
    0
  );

  const filteredProducts = products.filter((product) => {
    const term = search.toLowerCase();

    return (
      product.name?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term)
    );
  });

  
  const sections = [
      {
        id: "products",
        title: "Productos",
        icon: Package,
    },
  
    {
        id: "clients",
        title: "Clientes",
        icon: Users,
    },
    { 
      id: "suppliers",
        title: "Proveedores",
        icon: Truck,
    },

  ]


  if (!authUser) {
    return (
      <main className="miela-login-stage relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-rose-200 px-4 py-10 text-stone-700">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-pink-300/35 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-rose-300/40 blur-3xl"
        />

        <section className="miela-login-panel relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/90 bg-white/55 p-8 shadow-[0_24px_70px_rgba(190,100,140,0.18)] backdrop-blur-2xl sm:p-10">
          <div
            aria-hidden="true"
            className="miela-login-corner miela-login-corner-left"
          />

          <div
            aria-hidden="true"
            className="miela-login-corner miela-login-corner-right"
          />

          <div className="relative z-10">
            <h1 className="font-serif text-center text-3xl font-bold text-rose-800">
              Miela Stock
            </h1>

            <p className="mb-7 mt-3 text-center text-sm text-stone-500">
              {authMode === "login"
                ? "Ingresá a tu sistema de gestión"
                : "Creá tu cuenta en Miela Stock"}
            </p>

            {authMessage && (
              <p
                role="status"
                className="mb-4 rounded-2xl bg-green-50 p-4 text-sm text-green-700"
              >
                {authMessage}
              </p>
            )}

            {loginError && (
              <p
                role="alert"
                className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700"
              >
                {loginError}
              </p>
            )}

            {authMode === "login" ? (
              <form
                onSubmit={handleLogin}
                className="grid gap-4"
              >
                <label className="grid gap-2 text-sm font-medium text-stone-700">
                  Correo electrónico

                  <input
                    type="email"
                    required
                    autoComplete="username"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((previous) => ({
                        ...previous,
                        email: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-stone-700">
                  Contraseña

                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((previous) => ({
                        ...previous,
                        password: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </label>

                <button
                  type="submit"
                  disabled={loggingIn}
                  className={buttonClass}
                >
                  {loggingIn
                    ? "Ingresando..."
                    : "Iniciar sesión"}
                </button>

                <p className="text-center text-sm text-stone-500">
                  ¿No tenés una cuenta?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      changeAuthMode("register")
                    }
                    className="font-semibold text-rose-700 hover:underline"
                  >
                    Registrate aquí
                  </button>
                </p>
              </form>
            ) : (
              <form
                onSubmit={handleRegister}
                className="grid gap-4"
              >
                <label className="grid gap-2 text-sm font-medium text-stone-700">
                  Nombre

                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={50}
                    autoComplete="name"
                    value={registerForm.name}
                    onChange={(event) =>
                      setRegisterForm((previous) => ({
                        ...previous,
                        name: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-stone-700">
                  Correo electrónico

                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((previous) => ({
                        ...previous,
                        email: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-stone-700">
                  Contraseña

                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={registerForm.password}
                    onChange={(event) =>
                      setRegisterForm((previous) => ({
                        ...previous,
                        password: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />

                  <span className="text-xs text-stone-500">
                    Mínimo 8 caracteres
                  </span>
                </label>

                <label className="grid gap-2 text-sm font-medium text-stone-700">
                  Confirmar contraseña

                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={registerForm.confirmPassword}
                    onChange={(event) =>
                      setRegisterForm((previous) => ({
                        ...previous,
                        confirmPassword: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </label>

                <button
                  type="submit"
                  disabled={registering}
                  className={buttonClass}
                >
                  {registering
                    ? "Creando cuenta..."
                    : "Crear cuenta"}
                </button>

                <p className="text-center text-sm text-stone-500">
                  ¿Ya tenés una cuenta?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      changeAuthMode("login")
                    }
                    className="font-semibold text-rose-700 hover:underline"
                  >
                    Iniciar sesión
                  </button>
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
    );
  }

  
  

  return (
    <main className="min-h-screen bg-rose-50 text-stone-700">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 grid items-center gap-8 rounded-[32px] border border-rose-200 bg-white p-6 shadow-lg shadow-rose-200/40 lg:grid-cols-[0.9fr_1.3fr]  lg:p-8">
            <div className="mx-auto w-full max-w-[540px] text-center lg:pl-10 lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-700">
              Sistema de gestión
            </p>

            <h1 className="mt-2 font-serif text-5xl font-bold text-rose-800 sm:text-6xl">
              Miela Stock
            </h1>

            <p className="mt-2 text-sm text-stone-500 sm:text-lg">
              Inventario, productos, clientes y proveedores
            </p>
          </div>

          <img
            src={conejito}
            alt="Conejito de Miela"
            className="block h-auto w-full max-w-[1000px] rounded-[24px] object-cover"
          />
        </header>

        <nav
          aria-label="Secciones de administración"
          className="mb-8 flex flex-wrap gap-3"
        >
          {sections.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                aria-current={
                  section === item.id
                    ? "page"
                    : undefined
                }
                className={
                  section === item.id
                    ? "flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-md"
                    : "flex items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                }
              >
                <Icon size={18} />
                {item.title}
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100"
          >
            Cerrar sesión
          </button>
        </nav>

        {section === "products" && (
          <>
            <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                label="Productos"
                value={products.length}
                icon={Package}
              />

              <StatCard
                label="Unidades disponibles"
                value={totalStock}
                icon={Boxes}
              />

              <StatCard
                label="Valor del inventario"
                value={money.format(inventoryValue)}
                icon={Wallet}
              />
            </section>

            {message && (
              <p
                role="status"
                className="mb-6 rounded-2xl border border-rose-200 bg-white p-4 text-sm text-rose-700"
              >
                {message}
              </p>
            )}

            {isAdmin && (
                  <section className="mb-8">
                    <ProductForm
                      form={form}
                      onChange={handleChange}
                        onSubmit={handleSubmit}
                      onCancel={handleCancel}
                      editing={editingId !== null}
                      saving={saving}
                    />
                  </section>
          )}

            <section
              id="inventario-miela"
              className="rounded-[32px] border border-rose-200 bg-white p-5 shadow-lg shadow-rose-200/30 sm:p-7"
            >
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-rose-800">
                    Inventario
                  </h2>

                  <p className="mt-1 text-sm text-stone-500">
                    Productos registrados
                  </p>
                </div>

                <label className="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-3">
                  <Search
                    size={18}
                    className="text-rose-500"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Buscar producto"
                    className="w-full bg-transparent text-sm outline-none sm:w-44"
                  />
                </label>
              </div>

              {loading ? (
                <p className="text-stone-500">
                  Cargando inventario...
                </p>
              ) : filteredProducts.length === 0 ? (
                <p className="rounded-2xl bg-rose-50 p-6 text-center text-stone-500">
                  {search
                    ? "No se encontraron productos."
                    : "No hay productos para mostrar."}
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                    
                      key={product._id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      busy={busy ||         saving}
                        readOnly=   {!isAdmin}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {isAdmin && section === "clients" && (
          <AdminRecords
            title="Clientes"
            description="Registro y administración de clientes"
            storageKey="miela-clients"
            endpoint="/api/clients"
            readOnly={!isAdmin}
            fields={[
              { name: "name", label: "Nombre" },
              { name: "email", label: "Correo", type: "email" },
              {
                name: "phone",
                label: "Teléfono",
                required: false,
              },
            ]}
          />
        )}

        {isAdmin && section === "suppliers" && (
          <AdminRecords
            title="Proveedores"
            description="Registro y administración de proveedores"
            storageKey="miela-suppliers"
            endpoint="/api/suppliers"
            readOnly={!isAdmin}
            fields={[
              { name: "name", label: "Proveedor" },
              { name: "contact", label: "Contacto" },
              { name: "email", label:         "Correo", type: "email" },
            ]}
          />
        )}

        {section === "products" && (
          <div className="mx-auto flex w-full justify-center">
            <CategoryGallery
              categories={categories}
              onCategorySelect={(categoryName) =>
                setSearch(categoryName)
              }
              onShowAll={() => setSearch("")}
            />
          </div>
        )}

        {!isAdmin &&
          (section === "clients" || section === "suppliers") && (
            <section className="rounded-[32px] border border-rose-200 bg-white p-8 text-center shadow-lg shadow-rose-200/30">
              <h2 className="font-serif text-2xl font-bold text-rose-800">
                  {section === "clients" ? "Clientes" : "Proveedores"}
              </h2>

              <p role="status" className="mt-4 font-semibold text-rose-700">
                    Acceso exclusivo para administradores.
              </p>

              <p className="mt-2 text-sm text-stone-500">
                No tenés permisos para acceder a esta sección.
              </p>
            </section>
        )}

        <footer className="mt-8 py-4 text-center text-xs text-stone-400">
          Miela Stock · Gestión de inventario
        </footer>
      </div>
    </main>
  );
}

export default App;
