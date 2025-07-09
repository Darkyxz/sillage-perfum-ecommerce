# Configuración de Supabase Edge Functions para MercadoPago

## 1. Instalar Supabase CLI

```bash
npm install -g supabase
```

## 2. Inicializar Supabase en el proyecto

```bash
supabase init
```

## 3. Vincular con tu proyecto de Supabase

```bash
supabase link --project-ref TU_PROJECT_REF
```

## 4. Configurar variables de entorno

En tu proyecto de Supabase, ve a Settings > Edge Functions y agrega estas variables:

```
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

## 5. Desplegar las funciones

```bash
supabase functions deploy create-mercadopago-preference
supabase functions deploy mercadopago-webhook
```

## 6. Configurar webhook en MercadoPago

En tu cuenta de MercadoPago, configura el webhook URL:

```
https://tu-proyecto.supabase.co/functions/v1/mercadopago-webhook
```

## 7. Verificar que las funciones funcionen

Puedes probar las funciones desde el dashboard de Supabase en la sección Edge Functions.

## Notas importantes:

- Asegúrate de usar el token de acceso correcto (TEST para sandbox, PROD para producción)
- El webhook debe estar configurado para recibir notificaciones de pagos
- Las funciones tienen CORS habilitado para permitir llamadas desde el frontend
