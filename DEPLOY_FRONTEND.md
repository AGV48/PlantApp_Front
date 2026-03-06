# 🚀 Deploy del Frontend - PlantApp

## Opción Recomendada: Vercel

### 1️⃣ Preparar el Repositorio

Asegúrate de tener en tu repo:
- ✅ Código Angular listo
- ✅ `.gitignore` (excluye `node_modules`, `dist`, `.angular`)
- ✅ Build local funciona: `ng build --configuration production`

### 2️⃣ Crear Cuenta en Vercel

1. Ve a https://vercel.com
2. Sign up con GitHub
3. Click "Add New..." → "Project"
4. Import tu repositorio del frontend

### 3️⃣ Configurar Build

Vercel detecta Angular automáticamente. Verifica que tenga:

- **Framework Preset**: Angular
- **Build Command**: `ng build`
- **Output Directory**: `dist/plant-app-front/browser`
- **Install Command**: `npm install`

### 4️⃣ Variables de Entorno (Opcional)

Si quieres configurar la URL del backend manualmente:

```
API_URL=https://tu-backend.railway.app/api
```

⚠️ **NOTA**: Si no configuras esto, el código detecta automáticamente:
- Desarrollo: `http://localhost:3000/api`
- Producción: Usa la URL del backend que configuraste

### 5️⃣ Deploy

1. Click "Deploy"
2. Espera 1-2 minutos
3. Vercel te da una URL como: `https://plantapp-frontend.vercel.app`

### 6️⃣ Actualizar CORS del Backend

⚠️ **CRÍTICO**: Ahora que tienes la URL del frontend, actualiza el backend:

1. Ve a tu servicio de backend (Railway/Render)
2. Actualiza la variable `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://plantapp-frontend.vercel.app
   ```
3. Redeploy el backend (o reinicia)

### 7️⃣ Probar

1. Abre tu app: `https://tu-app.vercel.app`
2. Abre DevTools (F12) → Network tab
3. Navega a "Plantas" o "Enfermedades"
4. Verifica que las requests al backend sean exitosas (200 OK)

---

## Opción Alternativa: Netlify

### Pasos:

1. Ve a https://netlify.com
2. New site from Git
3. Conecta tu repositorio
4. Configuración:
   - **Build command**: `ng build --configuration production`
   - **Publish directory**: `dist/plant-app-front/browser`

5. Crear archivo `netlify.toml` en la raíz:

```toml
[build]
  command = "ng build --configuration production"
  publish = "dist/plant-app-front/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

6. Click "Deploy site"

---

## Opción Alternativa: Firebase Hosting

### Pasos:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Configuración:
# - Public directory: dist/plant-app-front/browser
# - Single-page app: Yes
# - Automatic builds: No

# Build
ng build --configuration production

# Deploy
firebase deploy --only hosting

# Tu app estará en: https://tu-proyecto.web.app
```

---

## 📋 Checklist Post-Deploy

- [ ] Frontend desplegado exitosamente
- [ ] URL del frontend anotada
- [ ] App carga correctamente en el navegador
- [ ] Network tab muestra requests exitosas al backend
- [ ] CORS del backend actualizado con URL del frontend
- [ ] Navegación entre páginas funciona
- [ ] Plantas locales se muestran
- [ ] Enfermedades se muestran
- [ ] Búsqueda de plantas externas funciona (Perenual API)
- [ ] Imágenes cargan correctamente
- [ ] Sin errores en la consola del navegador

---

## 🐛 Troubleshooting

### Error: "CORS policy blocked"

**Causa**: El backend no tiene la URL del frontend en CORS_ORIGIN

**Solución**:
1. Ve al dashboard de tu backend (Railway/Render)
2. Actualiza `CORS_ORIGIN=https://tu-frontend.vercel.app`
3. Reinicia el backend

### Error: "Failed to fetch" o "Network Error"

**Causa**: URL del backend incorrecta

**Solución**:
1. Abre DevTools → Network
2. Busca la request fallida
3. Verifica la URL a la que está llamando
4. Si es incorrecta, actualiza `environment.service.ts` con la URL real del backend
5. Redeploy el frontend

### Error: Página blanca / No carga

**Causa**: Build incorrecto o rutas mal configuradas

**Solución**:
1. Verificar que el build sea de producción
2. Agregar archivo de redirects (netlify.toml o vercel.json)
3. Verificar logs del deploy

### Error: Build falla en Vercel/Netlify

**Causa**: Dependencias faltantes o versión de Node incorrecta

**Solución**:
```bash
# Probar build local primero
ng build --configuration production

# Si funciona local, verificar:
# 1. Node version (debe ser 18+)
# 2. Dependencias en package.json
```

---

## 🔧 Configuración Avanzada

### Vercel.json (opcional)

Crear `vercel.json` en la raíz:

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Variables de Entorno por Entorno

Si necesitas diferentes backends para staging/production:

```typescript
// environment.service.ts
private getApiUrl(): string {
  const hostname = window.location.hostname;
  
  if (hostname.includes('staging')) {
    return 'https://backend-staging.railway.app/api';
  }
  
  if (hostname.includes('localhost')) {
    return 'http://localhost:3000/api';
  }
  
  return 'https://backend-production.railway.app/api';
}
```

---

## 🌐 Dominio Personalizado (Opcional)

### En Vercel:

1. Ve a Settings → Domains
2. Agrega tu dominio: `miapp.com`
3. Vercel te da instrucciones DNS
4. En tu proveedor de dominio (GoDaddy, Namecheap):
   - Agrega registro A apuntando a la IP de Vercel
   - O CNAME apuntando a `cname.vercel-dns.com`

5. Espera propagación DNS (5-30 minutos)

### Actualizar Backend CORS:

```
CORS_ORIGIN=https://miapp.com,https://www.miapp.com
```

---

## 💰 Costos

- **Vercel**: Gratis (100GB bandwidth/mes, suficiente para hobby)
- **Netlify**: Gratis (100GB bandwidth/mes)
- **Firebase**: Gratis (10GB storage, 360GB bandwidth/mes)

---

## ⏭️ URLs Finales

Anota tus URLs desplegadas:

```
Frontend: https://_____________________.vercel.app
Backend:  https://_____________________.railway.app

Health Check: https://_____________________.railway.app/api/ping
```

---

## 🎉 ¡Listo!

Tu aplicación está completamente desplegada. Ahora puedes:
- ✅ Compartir el link con otros
- ✅ Agregar el dominio a tu CV/portfolio
- ✅ Configurar monitoreo con UptimeRobot
- ✅ Agregar analytics (Google Analytics, etc.)
