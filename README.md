# Sillage-Perfum 🎭

Una elegante tienda de perfumes premium construida con React, Supabase y MercadoPago para el mercado chileno.

## ✨ Características

- **E-commerce Completo**: Catálogo de productos, carrito de compras, checkout integrado
- **Autenticación de Usuarios**: Registro, login y gestión de perfiles
- **Panel de Administración**: Gestión de productos, pedidos y usuarios
- **Backend PHP**: API REST con MySQL para gestión de datos
- **Diseño Responsivo**: Interfaz moderna y elegante
- **Base de Datos MySQL**: Almacenamiento seguro y eficiente

## 🚀 Tecnologías

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: PHP + MySQL (Hostinger)
- **Runtime**: Bun
- **UI**: Framer Motion, Lucide React

## 💰 Moneda

Esta aplicación está configurada para usar **Peso Chileno (CLP)** como moneda principal, optimizada para el mercado chileno.

## 🛠️ Instalación

1. **Clona el repositorio**

   ```bash
   git clone <repository-url>
   cd sillage-perfum
   ```

2. **Instala las dependencias**

   ```bash
   bun install
   ```

3. **Configura las variables de entorno**
   Crea un archivo `.env.local` con:

   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_BASE_URL=http://localhost:5173
   VITE_NODE_ENV=development
   VITE_APP_NAME=Sillage Perfume
   VITE_APP_DESCRIPTION=Tienda de perfumes premium
   ```

4. **Configura la Base de Datos**

   - Configura tu base de datos MySQL
   - Ejecuta los scripts SQL necesarios
   - Configura las credenciales en el backend

5. **Inicia el servidor de desarrollo**
   ```bash
   bun dev
   ```

## 📊 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── admin/          # Componentes del panel de administración
│   └── ui/             # Componentes de UI base
├── contexts/           # Contextos de React (Auth, Cart)
├── lib/                # Servicios y utilidades
├── pages/              # Páginas de la aplicación
└── main.jsx           # Punto de entrada
```

## 🔧 Configuración del Backend

1. Configura tu servidor PHP con MySQL
2. Asegúrate de que las credenciales de base de datos sean correctas
3. Verifica que el backend esté corriendo en el puerto 3001

## 📝 Scripts Disponibles

- `bun dev` - Servidor de desarrollo
- `bun build` - Construcción para producción
- `bun preview` - Vista previa de la construcción

## 🎨 Personalización

- **Colores**: Edita `tailwind.config.js` para cambiar la paleta de colores
- **Fuentes**: Configura las fuentes en `index.css`
- **Logo**: Reemplaza el logo en `src/components/Header.jsx`

## 🚀 Despliegue

1. **Construye la aplicación**

   ```bash
   bun build
   ```

2. **Despliega en tu plataforma preferida**
   - Vercel, Netlify, o cualquier hosting estático
   - Configura las variables de entorno en producción

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación, contacta al equipo de desarrollo.

---

**Sillage-Perfum** - Donde cada fragancia cuenta una historia ✨
