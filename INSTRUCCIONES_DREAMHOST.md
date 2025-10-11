# 📦 Instrucciones para Subir a DreamHost

**Fecha**: 2025-10-10 02:11  
**Build**: Listo en carpeta `/out`  
**Estado**: ✅ Configurado para DreamHost

---

## ✅ Build Completado

La carpeta `out/` ya está lista con:
- ✅ Sin basePath (rutas relativas)
- ✅ Tema día/noche funcionando
- ✅ Dashboard con auto-login
- ✅ Todos los colores corregidos

---

## 📤 Cómo Subir con FileZilla

### 1. Conectar a DreamHost

```
Host: flow-cfo.com (o tu servidor FTP)
Usuario: [tu usuario FTP]
Contraseña: [tu contraseña]
Puerto: 21 (FTP) o 22 (SFTP)
```

### 2. Navegar a la Carpeta Correcta

En el servidor remoto, ve a:
```
/home/[usuario]/flow-cfo.com/
```

O la carpeta raíz de tu dominio.

### 3. Subir Archivos

**Opción A - Reemplazar Todo:**
1. Elimina todo el contenido actual de la carpeta remota
2. Sube TODO el contenido de `/out/` a la raíz del dominio

**Opción B - Actualizar Solo lo Necesario:**
1. Sube la carpeta `_next/` (sobrescribe)
2. Sube todos los archivos `.html` (sobrescribe)
3. Sube `.nojekyll` si no existe

### 4. Verificar

Después de subir, verifica:
- https://flow-cfo.com/ → Home page
- https://flow-cfo.com/dashboard → Dashboard (auto-login)
- https://flow-cfo.com/login → Login page

---

## 🔧 Configuración Actual

### next.config.js
```javascript
{
  output: 'export',
  basePath: '',        // Sin basePath para DreamHost
  distDir: 'out',      // Carpeta 'out'
  images: { unoptimized: true }
}
```

### Dashboard
- ✅ Auto-autenticación habilitada
- ✅ Acceso directo sin login
- ✅ Modo demo funcional

### Tema
- ✅ Detección automática del sistema
- ✅ Toggle manual funciona
- ✅ Ambos conviven sin problemas

---

## 📁 Estructura de Archivos

```
out/
├── _next/              ← Archivos de Next.js
│   ├── static/
│   └── ...
├── api/                ← API routes
├── index.html          ← Home page
├── dashboard.html      ← Dashboard
├── login.html          ← Login
├── blog.html
├── precios.html
├── ...                 ← Todas las páginas
└── .nojekyll           ← Importante para routing
```

---

## 🧪 Verificación Post-Deploy

### Checklist
- [ ] Home page carga
- [ ] Tema día/noche funciona
- [ ] Toggle manual funciona
- [ ] Dashboard accesible sin login
- [ ] Login funciona con credenciales demo
- [ ] Todas las páginas cargan
- [ ] Responsive funciona
- [ ] No hay errores en consola

### Credenciales Demo
```
Email: admin@flow.finance
Password: demo123
```

### URLs de Prueba
```
https://flow-cfo.com/
https://flow-cfo.com/dashboard
https://flow-cfo.com/login
https://flow-cfo.com/precios
https://flow-cfo.com/blog
```

---

## 🔄 Para Futuros Updates

### Opción 1: Build para DreamHost
```bash
# Ya está configurado así
npm run build
# Genera en /out
# Subir con FileZilla
```

### Opción 2: Build para GitHub Pages
```bash
# Editar next.config.js:
basePath: '/Flow'
distDir: 'docs'

# Build
npm run build

# Push a GitHub
git add docs/
git commit -m "Update GitHub Pages"
git push origin main
```

---

## 📝 Diferencias DreamHost vs GitHub Pages

| Aspecto | DreamHost | GitHub Pages |
|---------|-----------|--------------|
| basePath | `''` (sin basePath) | `'/Flow'` |
| distDir | `'out'` | `'docs'` |
| Subida | FileZilla (FTP) | Git push |
| URL | flow-cfo.com | corevision1997.github.io/Flow |
| Dashboard | Auto-login ✓ | Auto-login ✓ |
| Tema | Detecta ✓ | Detecta ✓ |

---

## ⚠️ Importante

1. **No subas la carpeta `out/` a GitHub** (ya está en .gitignore)
2. **Mantén `docs/` para GitHub Pages**
3. **Usa `out/` solo para DreamHost**
4. **Cambia `next.config.js` según donde vayas a deployar**

---

## 🎯 Resumen

1. ✅ Build completado → carpeta `out/`
2. 📤 Conecta FileZilla a flow-cfo.com
3. 📁 Sube contenido de `out/` a la raíz
4. 🧪 Verifica que todo funcione
5. 🎉 Listo!

---

**Todo está listo para subir a DreamHost** 🚀
