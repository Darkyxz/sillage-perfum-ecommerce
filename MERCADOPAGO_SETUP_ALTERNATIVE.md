# Configuración Alternativa de MercadoPago (Sin CLI)

## Opción 1: Crear Edge Functions desde el Dashboard de Supabase

### Paso 1: Ir al Dashboard de Supabase

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Navega a **Edge Functions** en el menú lateral

### Paso 2: Crear la función create-mercadopago-preference

1. Haz clic en **"Create a new function"**
2. Nombre: `create-mercadopago-preference`
3. Copia y pega el código del archivo `supabase/functions/create-mercadopago-preference/index.ts`

### Paso 3: Crear la función mercadopago-webhook

1. Haz clic en **"Create a new function"** nuevamente
2. Nombre: `mercadopago-webhook`
3. Copia y pega el código del archivo `supabase/functions/mercadopago-webhook/index.ts`

### Paso 4: Configurar Variables de Entorno

1. Ve a **Settings > Edge Functions**
2. Agrega estas variables:
   ```
   MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   ```

## Opción 2: Usar una función simple sin webhook (Temporal)

Si las Edge Functions son complicadas, podemos crear una versión simplificada que funcione directamente desde el frontend:

### Crear archivo: src/lib/mercadopagoService.js

```javascript
// Función temporal para crear preferencias de MercadoPago
export const createMercadoPagoPreference = async (
  items,
  payer,
  backUrls,
  externalReference
) => {
  try {
    // Nota: En producción, esto debería ir en una Edge Function
    // Por ahora, usamos una API key pública (solo para sandbox)
    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Tu token de prueba
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          payer,
          back_urls: backUrls,
          external_reference: externalReference,
          statement_descriptor: "SILLAGE-PERFUM",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`MercadoPago API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating preference:", error);
    throw error;
  }
};
```

## Paso 5: Ejecutar Scripts de Base de Datos

### Ejecutar en Supabase SQL Editor:

1. **check-orders-table.sql** - Para verificar/arreglar la tabla orders
2. **test-orders-update.sql** - Para probar que las actualizaciones funcionan

## Paso 6: Configurar MercadoPago

1. Ve a tu cuenta de MercadoPago
2. Obtén tu Access Token de prueba
3. Configura las URLs de retorno en tu aplicación

## Notas Importantes:

- **Para desarrollo**: Usa tokens de prueba (TEST-...)
- **Para producción**: Usa tokens de producción (APP-...)
- **Seguridad**: En producción, nunca expongas el Access Token en el frontend
- **Webhooks**: Configura los webhooks en MercadoPago para actualizaciones automáticas

## URLs de Retorno para Configurar:

```
Éxito: https://tu-dominio.com/pago-exitoso
Fallo: https://tu-dominio.com/pago-fallido
Pendiente: https://tu-dominio.com/pago-pendiente
```
