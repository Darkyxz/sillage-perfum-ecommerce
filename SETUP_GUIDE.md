# 🚀 Guía de Configuración Rápida - Sillage-Perfum

## ✅ Problemas Solucionados

1. **Error de MercadoPago**: Removido el campo `auto_return` que causaba el error
2. **Error de Base de Datos**: Creados scripts para verificar/arreglar la tabla `orders`
3. **Servicio Simplificado**: Creado `mercadopagoService.js` que funciona directamente desde el frontend
4. **Variables de Entorno**: Configurado para usar `.env` en lugar de tokens hardcodeados
5. **react-helmet-async**: Instalado el paquete faltante

## 📋 Pasos para Configurar

### Paso 1: Configurar Variables de Entorno

1. **Crea un archivo `.env`** en la raíz del proyecto:

   ```bash
   # Copia el archivo de ejemplo
   cp env.example .env
   ```

2. **Edita el archivo `.env`** y agrega tu token de MercadoPago:
   ```env
   VITE_MERCADOPAGO_ACCESS_TOKEN=TEST-8149006760256742-120622-cf566bf37ed0daaf26b2fea02effe845-768470411
   ```

### Paso 2: Ejecutar Scripts de Base de Datos

Ve a tu **Supabase Dashboard > SQL Editor** y ejecuta estos scripts en orden:

1. **`check-orders-table.sql`** - Verifica y arregla la tabla orders
2. **`test-orders-update.sql`** - Prueba que las actualizaciones funcionan

### Paso 3: Probar la Aplicación

1. Asegúrate de que tu aplicación esté corriendo (`bun dev`)
2. Inicia sesión en la aplicación
3. Agrega productos al carrito
4. Intenta hacer un pedido

## 🔧 Archivos Modificados

- ✅ `src/pages/Cart.jsx` - Removido código de MercadoPago innecesario
- ✅ `src/lib/mercadopagoService.js` - Servicio simplificado con variables de entorno
- ✅ `check-orders-table.sql` - Script para verificar base de datos
- ✅ `test-orders-update.sql` - Script de prueba
- ✅ `env.example` - Archivo de ejemplo para variables de entorno
- ✅ `package.json` - Agregado react-helmet-async

## 🎯 Resultado Esperado

Después de estos pasos:

- ✅ Los pedidos se crearán correctamente en la base de datos
- ✅ MercadoPago generará enlaces de pago válidos
- ✅ El usuario será redirigido a MercadoPago para completar el pago
- ✅ No habrá errores de `updated_at` o `auto_return`
- ✅ Las variables de entorno estarán configuradas correctamente

## 🆘 Si Algo No Funciona

1. **Verifica que el archivo `.env` existe** y tiene el token correcto
2. **Reinicia el servidor de desarrollo** después de crear el `.env`
3. **Verifica la consola del navegador** para errores específicos
4. **Revisa los logs de Supabase** en el dashboard
5. **Asegúrate de que el token de MercadoPago sea correcto**
6. **Ejecuta los scripts de base de datos** si hay errores de `updated_at`

## 📞 Próximos Pasos

Una vez que el pago básico funcione, puedes:

1. Configurar webhooks para actualizaciones automáticas
2. Crear Edge Functions para mayor seguridad
3. Implementar notificaciones por email
4. Agregar más métodos de pago

## 🔒 Seguridad

- ✅ El token de MercadoPago ahora está en variables de entorno
- ✅ El archivo `.env` está en `.gitignore` (no se sube al repositorio)
- ✅ Para producción, usa tokens que empiecen con `APP-` en lugar de `TEST-`

¡Todo listo para probar! 🎉
