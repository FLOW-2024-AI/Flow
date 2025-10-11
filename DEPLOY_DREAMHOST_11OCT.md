# 🚀 Deploy a Dreamhost - 11 de Octubre 2025

**Build Completado**: ✅  
**Fecha**: 11 de Octubre 2025, 18:43  
**Versión**: Sistema completo con 18 apps y sidebars internos

---

## ✅ Estado del Build

### **Build Exitoso**
```bash
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (47/47)
✓ Collecting build traces
✓ Finalizing page optimization
```

### **Páginas Generadas**: 47
- 1 página principal
- 18 apps con sidebars
- 28 páginas adicionales (login, blog, etc.)

---

## 📂 Contenido del Build

### **Directorio**: `/out`

#### **Apps Generadas** (18):
```
✅ /apps/analytics.html
✅ /apps/automatizaciones.html
✅ /apps/bancario.html
✅ /apps/caja-bancos.html
✅ /apps/chat-ia.html
✅ /apps/cobranza.html
✅ /apps/conciliacion.html
✅ /apps/cuentas-pagar.html
✅ /apps/dashboard.html
✅ /apps/ecosistema.html
✅ /apps/facturacion.html
✅ /apps/facturas-registradas.html
✅ /apps/flujo-proyectado.html
✅ /apps/gestion-riesgos.html
✅ /apps/planificacion.html
✅ /apps/predicciones.html
✅ /apps/presupuesto.html
✅ /apps/reportes.html
✅ /apps/salud-financiera.html
```

#### **Archivos Importantes**:
```
✅ .htaccess (configurado para SPA)
✅ 404.html (página de error)
✅ _next/ (assets estáticos)
✅ apps.html (grid de aplicativos)
✅ login.html
✅ index.html (landing page)
```

---

## 🔧 Instrucciones de Deploy

### **Opción 1: Copiar Todo el Directorio `out`**

1. **Conectar por FTP/SFTP a Dreamhost**
   ```
   Host: ftp.tudominio.com
   Usuario: tu_usuario
   Puerto: 22 (SFTP) o 21 (FTP)
   ```

2. **Navegar al directorio web**
   ```
   cd ~/tudominio.com
   ```

3. **Respaldar versión anterior** (opcional)
   ```bash
   mv public_html public_html_backup_11oct
   ```

4. **Copiar contenido de `out`**
   ```bash
   # Desde tu máquina local
   scp -r out/* usuario@host:~/tudominio.com/public_html/
   ```

5. **Verificar permisos**
   ```bash
   chmod -R 755 public_html
   ```

---

### **Opción 2: Usar FileZilla o Cliente FTP**

1. **Abrir FileZilla**
2. **Conectar a Dreamhost**
   - Host: `ftp.tudominio.com`
   - Usuario: tu usuario
   - Contraseña: tu contraseña
   - Puerto: 22 (SFTP)

3. **Navegar a**:
   - Local: `/Users/hugochavez/Documents/GitHub/finka-finance/out`
   - Remoto: `/home/usuario/tudominio.com/public_html`

4. **Seleccionar todo en `out`** y **arrastrar** al servidor

5. **Esperar a que termine la transferencia**

---

### **Opción 3: Usar rsync (Recomendado)**

```bash
# Desde tu máquina local
rsync -avz --delete \
  /Users/hugochavez/Documents/GitHub/finka-finance/out/ \
  usuario@host:~/tudominio.com/public_html/
```

**Ventajas**:
- Solo sube archivos modificados
- Más rápido
- Elimina archivos obsoletos

---

## 🔍 Verificación Post-Deploy

### **1. Verificar URLs**

#### **Landing Page**
```
https://tudominio.com
```

#### **Grid de Apps**
```
https://tudominio.com/apps
```

#### **Login**
```
https://tudominio.com/login
```

#### **Apps Individuales**
```
https://tudominio.com/apps/facturacion
https://tudominio.com/apps/cobranza
https://tudominio.com/apps/chat-ia
https://tudominio.com/apps/dashboard
... (todas las 18 apps)
```

### **2. Verificar Funcionalidades**

- ✅ Navegación entre páginas
- ✅ Logo de Flow vuelve a `/apps`
- ✅ Sidebars internos visibles
- ✅ Sidebars colapsables
- ✅ Theme claro/oscuro
- ✅ Responsive design
- ✅ Login funcional

### **3. Verificar .htaccess**

El archivo `.htaccess` debe estar en la raíz y contener:

```apache
# Rewrite rules for Next.js static export
RewriteEngine On

# Redirect to HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle .html extension
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L]

# Fallback to 404
ErrorDocument 404 /404.html

# Cache control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

---

## 📊 Tamaño del Build

```bash
# Verificar tamaño
du -sh out/
```

**Estimado**: ~50-100 MB

---

## 🐛 Troubleshooting

### **Problema: Páginas muestran 404**

**Solución**:
1. Verificar que `.htaccess` esté en la raíz
2. Verificar que mod_rewrite esté habilitado
3. Contactar soporte de Dreamhost

### **Problema: Assets no cargan**

**Solución**:
1. Verificar que `_next/` esté copiado
2. Verificar permisos: `chmod -R 755 public_html`
3. Limpiar caché del navegador

### **Problema: Rutas de apps no funcionan**

**Solución**:
1. Verificar que archivos `.html` estén en `/apps/`
2. Verificar reglas de rewrite en `.htaccess`
3. Probar con extensión: `/apps/facturacion.html`

### **Problema: Theme no cambia**

**Solución**:
1. Limpiar localStorage del navegador
2. Verificar que JavaScript esté habilitado
3. Revisar consola del navegador

---

## 📝 Checklist de Deploy

### **Pre-Deploy**
- [x] Build completado sin errores
- [x] 47 páginas generadas
- [x] 18 apps con sidebars
- [x] .htaccess configurado
- [x] Assets optimizados

### **Durante Deploy**
- [ ] Conectar a Dreamhost
- [ ] Respaldar versión anterior
- [ ] Copiar archivos de `out/`
- [ ] Verificar permisos
- [ ] Verificar .htaccess

### **Post-Deploy**
- [ ] Verificar landing page
- [ ] Verificar grid de apps
- [ ] Verificar login
- [ ] Probar 5 apps aleatorias
- [ ] Verificar sidebars
- [ ] Verificar responsive
- [ ] Verificar theme
- [ ] Limpiar caché CDN (si aplica)

---

## 🎯 URLs de Prueba

### **Críticas**
1. `https://tudominio.com` - Landing
2. `https://tudominio.com/login` - Login
3. `https://tudominio.com/apps` - Grid
4. `https://tudominio.com/apps/dashboard` - Dashboard

### **Apps de Prueba**
5. `https://tudominio.com/apps/facturacion`
6. `https://tudominio.com/apps/cobranza`
7. `https://tudominio.com/apps/chat-ia`
8. `https://tudominio.com/apps/analytics`
9. `https://tudominio.com/apps/salud-financiera`

---

## 📞 Soporte

### **Dreamhost**
- Panel: https://panel.dreamhost.com
- Soporte: https://help.dreamhost.com
- SSH: `ssh usuario@host`

### **Logs**
```bash
# Ver logs de error
tail -f ~/logs/tudominio.com/http/error.log

# Ver logs de acceso
tail -f ~/logs/tudominio.com/http/access.log
```

---

## ✅ Resultado Esperado

Después del deploy deberías tener:

- ✅ **Landing page** funcional
- ✅ **Grid de 18 apps** con iconos
- ✅ **Login** funcional
- ✅ **18 apps** con sidebars internos
- ✅ **Navegación** fluida
- ✅ **Logo Flow** vuelve al grid
- ✅ **Sidebars** colapsables
- ✅ **Responsive** en móvil/tablet/desktop
- ✅ **Theme** claro/oscuro
- ✅ **Performance** optimizada

---

## 🚀 Comandos Rápidos

### **Build Local**
```bash
npm run build
```

### **Deploy con rsync**
```bash
rsync -avz --delete out/ usuario@host:~/tudominio.com/public_html/
```

### **Verificar Deploy**
```bash
curl -I https://tudominio.com
curl -I https://tudominio.com/apps
```

### **Limpiar Caché**
```bash
# En el servidor
rm -rf ~/tudominio.com/public_html/.htaccess
# Luego volver a copiar .htaccess
```

---

**¡Deploy listo para ejecutar!** 🎉

**Tiempo estimado**: 5-10 minutos  
**Archivos a copiar**: ~500 archivos  
**Tamaño total**: ~50-100 MB
