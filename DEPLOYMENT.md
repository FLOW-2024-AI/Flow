# Guía de Despliegue - Flow Finance

Este proyecto tiene dos configuraciones de despliegue en diferentes branches:

## 📋 Branches

### 1. `main` - GitHub Pages
**Configuración:**
- `basePath: '/Flow'`
- `distDir: 'docs'`
- URL: https://flow-2024-ai.github.io/Flow/

**Cómo desplegar:**
```bash
git checkout main
npm run build
git add docs/
git commit -m "Update GitHub Pages build"
git push origin main
```

### 2. `dreamhost` - DreamHost / Dominio Propio
**Configuración:**
- Sin `basePath`
- `distDir: 'out'`
- URL: Tu dominio personalizado

**Cómo desplegar:**
```bash
git checkout dreamhost
npm run build
```

Luego sube el contenido de la carpeta `out/` a DreamHost.

---

## 🚀 Despliegue en DreamHost

### Opción 1: FTP/SFTP Manual
1. Cambia a la branch dreamhost: `git checkout dreamhost`
2. Genera el build: `npm run build`
3. Conecta por FTP/SFTP a tu hosting DreamHost
4. Sube todo el contenido de la carpeta `out/` a la carpeta raíz de tu dominio (usualmente `~/yourdomain.com/`)

### Opción 2: SSH + Git (Recomendado)
1. Conéctate a DreamHost por SSH
2. Navega a la carpeta de tu dominio: `cd ~/yourdomain.com/`
3. Clona el repositorio: `git clone https://github.com/FLOW-2024-AI/Flow.git .`
4. Cambia a la branch dreamhost: `git checkout dreamhost`
5. Instala dependencias: `npm install`
6. Genera el build: `npm run build`
7. Mueve los archivos: `mv out/* ./` o configura el servidor para servir desde `out/`

### Configuración del Servidor Web
Asegúrate de que tu servidor web (Apache/Nginx) esté configurado para:
- Servir archivos estáticos desde la carpeta `out/`
- Redirigir todas las rutas a `index.html` (para SPA routing)

**Ejemplo .htaccess para Apache:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🔄 Mantener ambas branches sincronizadas

Cuando hagas cambios en el código:

1. **Haz cambios en `main`:**
```bash
git checkout main
# Haz tus cambios
git add .
git commit -m "Tu mensaje"
git push origin main
```

2. **Sincroniza con `dreamhost`:**
```bash
git checkout dreamhost
git merge main
# Resuelve conflictos si los hay (usualmente solo en next.config.js)
git push origin dreamhost
```

---

## 💻 Desarrollo Local

Para desarrollo local, ambas branches funcionan igual:
```bash
npm run dev
```
Abre http://localhost:3000

---

## 📝 Credenciales Demo

**Login:**
- Email: `admin@flow.finance`
- Password: `demo123`

---

## 🛠️ Comandos Útiles

```bash
# Ver en qué branch estás
git branch

# Cambiar de branch
git checkout main
git checkout dreamhost

# Ver diferencias entre branches
git diff main dreamhost

# Listar todas las branches
git branch -a
```
