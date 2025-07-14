# Sillage-Perfum 🎭

Una elegante tienda de perfumes premium construida con React, Supabase y MercadoPago para el mercado chileno.

## ✨ Características

- **E-commerce Completo**: Catálogo de productos, carrito de compras, checkout integrado
- **Autenticación de Usuarios**: Registro, login y gestión de perfiles
- **Panel de Administración**: Gestión de productos, pedidos y usuarios
- **Pagos Seguros**: Integración con MercadoPago (CLP)
- **Diseño Responsivo**: Interfaz moderna y elegante
- **Base de Datos en Tiempo Real**: Supabase para datos y autenticación

## 🚀 Tecnologías

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Functions)
- **Pagos**: MercadoPago
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
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

4. **Configura Supabase**

   - Crea un proyecto en [Supabase](https://supabase.com)
   - Ejecuta los scripts SQL en `database-setup.sql`
   - Configura las políticas de seguridad

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

## 🔧 Configuración de MercadoPago

1. Crea una cuenta en [MercadoPago](https://mercadopago.com)
2. Configura las credenciales en Supabase Functions
3. Asegúrate de que la moneda esté configurada como CLP

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
