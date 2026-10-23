# Miela Stock

### Proyecto Final — Desarrollo Full Stack | ADA

Miela Stock es una aplicación web de gestión de inventario desarrollada con React, Node.js, Express y MongoDB.

Permite administrar productos, clientes y proveedores mediante una interfaz intuitiva y adaptable a diferentes dispositivos.

## Tecnologías

**Frontend**
- React
- JavaScript
- Vite
- Tailwind CSS

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt

**Herramientas y despliegue**
- Git y GitHub
- Postman
- MongoDB Compass
- MongoDB Atlas
- Render
- Vercel

## Funcionalidades

- Registro e inicio de sesión.
- Autenticación mediante JWT.
- Control de acceso por roles.
- Gestión de productos, clientes y proveedores.
- Operaciones CRUD.
- Validaciones y manejo de errores.
- Interfaz responsive.
- Integración con API REST.

## Enlaces del proyecto

**Aplicación web:**  
https://miela-stock-frontend.vercel.app

**Backend — Render:**  
https://miela-stock-backend.onrender.com

**Repositorio frontend:**  
https://github.com/carinaantinir/miela_stock_frontend

**Repositorio backend:**  
https://github.com/carinaantinir/miela_stock_backend

## Arquitectura

La aplicación utiliza una arquitectura cliente-servidor.

El frontend desarrollado con React consume una API REST implementada con Node.js y Express. El backend utiliza Mongoose para comunicarse con MongoDB Atlas.

**Flujo de comunicación:**

React (Vercel) → Express (Render) → MongoDB Atlas

## Instalación local

Clonar el repositorio:

```bash
git clone https://github.com/carinaantinir/miela_stock_frontend.git
cd miela_stock_frontend
```

Instalar dependencias:

```bash
pnpm install
```

Configurar la variable de entorno `VITE_API_URL` con la dirección del backend.

Iniciar el proyecto:

```bash
pnpm dev
```

## Integración con el backend

Las solicitudes HTTP se realizan mediante Fetch API y están centralizadas en `src/lib/api.js`.

La API REST gestiona la autenticación de usuarios y las operaciones sobre productos, clientes y proveedores.

El repositorio del backend incluye las instrucciones de instalación y la colección de pruebas de Postman.

## API REST

| Recurso | Endpoint |
|---------|----------|
| Registro | `/users/register` |
| Inicio de sesión | `/users/login` |
| Productos | `/api/products` |
| Clientes | `/api/clients` |
| Proveedores | `/api/suppliers` |

## Despliegue

La aplicación se encuentra publicada en Vercel, con el backend alojado en Render y la base de datos en MongoDB Atlas.

## Autora

**Carina Antiñir**  
 
    ADA — 2026