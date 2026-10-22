# Miela Stock — Frontend

## Descripción

Miela Stock es una aplicación web de gestión de inventarios desarrollada con React, que permite administrar productos, clientes y proveedores mediante una interfaz moderna, intuitiva y adaptable a distintos dispositivos.

El proyecto constituye la interfaz de usuario de una aplicación Full Stack, conectada a una API RESTful desarrollada con Node.js, Express y MongoDB.

## Tecnologías utilizadas

- React
- JavaScript (JSX)
- Vite
- Tailwind CSS
- PNPM
- API REST
- Autenticación JWT

## Funcionalidades

### Autenticación
- Registro e inicio de sesión.
- Autenticación mediante JWT.
- Control de acceso según roles.

### Gestión de productos
- Visualización del inventario.
- Búsqueda y filtrado por categorías.
- Consulta de precios y unidades disponibles.
- Creación, edición y eliminación de productos para administradores.

### Gestión de clientes y proveedores
- Administración de registros mediante operaciones CRUD.
- Acceso restringido a administradores.

### Interfaz
- Diseño responsive.
- Componentes reutilizables.
- Interfaz desarrollada con React y Tailwind CSS.
- Comunicación con el backend mediante solicitudes HTTP.

## Roles de usuario

**Administrador:** acceso a la gestión de productos, clientes y proveedores.

**Usuario:** acceso de consulta al inventario, sin permisos para modificar registros ni consultar información privada de clientes y proveedores.

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO_FRONTEND>
```

Ingresar al directorio:

```bash
cd miela_stock_frontend
```

Instalar dependencias:

```bash
pnpm install
```

Iniciar el entorno de desarrollo:

```bash
pnpm dev
```

## Compilación de producción

```bash
pnpm build
```

Para visualizar la compilación:

```bash
pnpm preview
```

## Calidad del código

El proyecto utiliza ESLint para el análisis estático del código.

```bash
pnpm lint
```

## Integración con el backend

El frontend consume la API RESTful de Miela Stock para realizar operaciones de autenticación y gestión de registros.

Para utilizarlo localmente, es necesario disponer de la API y de su base de datos en funcionamiento.

## Despliegue

Frontend: Vercel.

Backend: Render.

Base de datos: MongoDB Atlas.

Las URL de producción se incorporarán una vez verificado el despliegue.

## Proyecto académico

Proyecto integrador desarrollado durante la formación Backend de ADA IT, aplicando componentes React, consumo de APIs, autenticación, control de acceso y arquitectura cliente-servidor.