# Configuración de Supabase

## Pasos para configurar la base de datos

### 1. Acceder a Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto `sillage-perfum`

### 2. Ejecutar el script SQL

**Opción A: Script completo (recomendado para instalación nueva)**

1. Ve a la sección **SQL Editor** en el panel lateral
2. Crea una nueva consulta
3. Copia y pega el contenido del archivo `database-setup.sql`
4. Ejecuta el script

**Opción B: Script de corrección (si obtienes errores de políticas duplicadas)**

1. Ve a la sección **SQL Editor** en el panel lateral
2. Crea una nueva consulta
3. Copia y pega el contenido del archivo `fix-profiles-table.sql`
4. Ejecuta el script

### 3. Configurar la autenticación (Opcional para desarrollo)

Para deshabilitar la confirmación de email durante el desarrollo:

1. Ve a **Authentication** > **Settings**
2. Desactiva **Enable email confirmations**
3. Guarda los cambios

### 4. Verificar la configuración

1. Ve a **Table Editor**
2. Verifica que la tabla `profiles` existe con las columnas:
   - `id` (UUID, Primary Key)
   - `full_name` (Text)
   - `avatar_url` (Text, nullable)
   - `role` (Text, default: 'user')
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

### 5. Crear un usuario administrador

Para crear un usuario administrador, ejecuta este SQL después de registrarte:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'TU_USER_ID_AQUI';
```

## Estructura de la base de datos

### Tabla `profiles`

- **id**: UUID (referencia a auth.users)
- **full_name**: Nombre completo del usuario
- **avatar_url**: URL de la imagen de perfil (opcional)
- **role**: Rol del usuario ('user' o 'admin')
- **created_at**: Fecha de creación
- **updated_at**: Fecha de última actualización

### Tabla `products` (ya existente)

- **id**: ID del producto
- **name**: Nombre del producto
- **description**: Descripción
- **price**: Precio
- **image_url**: URL de la imagen
- **category**: Categoría
- **brand**: Marca
- **stock_quantity**: Cantidad en stock
- **in_stock**: Boolean si está disponible
- **created_at**: Fecha de creación

## Políticas de seguridad (RLS)

Las siguientes políticas están configuradas automáticamente:

1. **SELECT**: Los usuarios pueden ver su propio perfil
2. **UPDATE**: Los usuarios pueden actualizar su propio perfil
3. **INSERT**: Los usuarios pueden insertar su propio perfil (automático)

## Triggers automáticos

1. **on_auth_user_created**: Crea automáticamente un perfil cuando se registra un usuario
2. **update_profiles_updated_at**: Actualiza automáticamente el timestamp `updated_at`

## Solución de problemas

### Error: "policy already exists"

- **Causa**: Las políticas ya fueron creadas anteriormente
- **Solución**: Usa el archivo `fix-profiles-table.sql` en lugar de `database-setup.sql`

### Error: "Could not find the 'email' column"

- **Causa**: La tabla `profiles` no existe o no tiene la estructura correcta
- **Solución**: Ejecuta el script SQL completo

### Error: "Invalid login credentials"

- **Causa**: El usuario no existe o la contraseña es incorrecta
- **Solución**: Verifica que el usuario se haya registrado correctamente

### Error: "Email not confirmed"

- **Causa**: La confirmación de email está habilitada
- **Solución**: Desactiva la confirmación de email en Authentication > Settings

## Notas importantes

- En producción, mantén habilitada la confirmación de email
- Los usuarios administradores pueden acceder al panel de administración
- La tabla `profiles` se crea automáticamente cuando un usuario se registra
- Todos los cambios en `updated_at` se actualizan automáticamente
- Si obtienes errores de políticas duplicadas, usa `fix-profiles-table.sql`
