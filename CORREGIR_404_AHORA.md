# 🔴 CORREGIR 404 en DreamHost - PASO A PASO

**Problema Actual**: Error 404 al navegar en flow-cfo.com  
**Causa**: El archivo `.htaccess` no está funcionando o no está subido

---

## ✅ PASO 1: Verificar Archivos Locales

El archivo `.htaccess` mejorado ya está en:
```
/Users/hugochavez/Documents/GitHub/finka-finance/out/.htaccess
```

Verifica que existe:
```bash
ls -la out/.htaccess
```

---

## 📤 PASO 2: Subir con FileZilla

### A. Conectar
```
Host: flow-cfo.com
Usuario: [tu usuario]
Puerto: 22 (SFTP recomendado) o 21 (FTP)
```

### B. Navegar a la Raíz
En el panel derecho (servidor remoto), ve a:
```
/home/[usuario]/flow-cfo.com/
```

### C. Activar "Ver Archivos Ocultos"
En FileZilla:
1. Menú → Servidor → Forzar mostrar archivos ocultos
2. O: Ver → Mostrar archivos ocultos

### D. Verificar si .htaccess Existe
Busca `.htaccess` en la lista de archivos del servidor.

**Si existe**:
- Elimínalo (click derecho → Eliminar)

**Si no existe**:
- Continúa al siguiente paso

### E. Subir el Nuevo .htaccess
1. En el panel izquierdo (local), navega a: `out/`
2. Busca `.htaccess`
3. Arrastra `.htaccess` al panel derecho (raíz del servidor)
4. Confirma la subida

### F. Verificar Permisos
1. Click derecho en `.htaccess` (en el servidor)
2. Permisos de archivo
3. Valor numérico: **644**
4. OK

---

## 🧪 PASO 3: Probar

### Prueba 1: Limpiar Cache
```
1. Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)
2. O abrir en ventana privada/incógnito
```

### Prueba 2: Navegar
```
1. Ir a: https://flow-cfo.com/
2. Click en "Dashboard" en el navbar
3. ✅ Debería cargar sin 404
```

### Prueba 3: URL Directa
```
1. Ir directamente a: https://flow-cfo.com/dashboard
2. ✅ Debería cargar sin 404
```

---

## 🔍 PASO 4: Diagnóstico si Sigue Fallando

### Opción A: Verificar que .htaccess se Subió
En FileZilla, actualiza la vista del servidor (F5) y verifica que `.htaccess` esté ahí.

### Opción B: Verificar Contenido del .htaccess
1. En FileZilla, click derecho en `.htaccess`
2. Ver/Editar
3. Debe empezar con:
```apache
# Next.js Static Export - Routing for DreamHost
Options -MultiViews
RewriteEngine On
```

### Opción C: Verificar que los .html Existen
En FileZilla, verifica que existan:
- `dashboard.html`
- `login.html`
- `precios.html`
- etc.

### Opción D: Probar .htaccess Alternativo
Si nada funciona, prueba este `.htaccess` más simple:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]
DirectoryIndex index.html
ErrorDocument 404 /404.html
```

Crea un archivo con este contenido y súbelo.

---

## 🆘 PASO 5: Contactar Soporte DreamHost

Si después de todo sigue sin funcionar:

1. **Verifica que mod_rewrite esté habilitado**
   - DreamHost lo tiene habilitado por defecto
   - Pero puede estar deshabilitado en tu cuenta

2. **Contacta soporte de DreamHost**
   - Panel de DreamHost → Soporte
   - Pregunta: "¿Está mod_rewrite habilitado en mi dominio flow-cfo.com?"
   - Menciona que necesitas .htaccess para rewrite rules

---

## 📋 Checklist de Verificación

- [ ] Archivo `.htaccess` existe en `out/`
- [ ] FileZilla conectado a flow-cfo.com
- [ ] "Ver archivos ocultos" activado en FileZilla
- [ ] `.htaccess` eliminado del servidor (si existía uno viejo)
- [ ] Nuevo `.htaccess` subido a la raíz
- [ ] Permisos 644 en `.htaccess`
- [ ] Cache del navegador limpiado
- [ ] Probado en ventana privada
- [ ] Archivos `.html` existen en el servidor
- [ ] mod_rewrite habilitado (contactar soporte si no)

---

## 🎯 Resultado Esperado

**Después de subir el .htaccess correctamente**:

✅ https://flow-cfo.com/ → Funciona  
✅ https://flow-cfo.com/dashboard → Funciona  
✅ https://flow-cfo.com/login → Funciona  
✅ https://flow-cfo.com/precios → Funciona  
✅ Navegación con links → Funciona  
✅ Recarga de página (F5) → Funciona  

---

## 📝 Notas Importantes

1. **El .htaccess DEBE estar en la raíz** del dominio, no en subcarpetas
2. **Los permisos DEBEN ser 644**, no 755 ni otros
3. **Limpia el cache** del navegador después de subir
4. **Usa ventana privada** para probar sin cache
5. **El archivo se llama `.htaccess`** (con punto al inicio)

---

**Si sigues teniendo problemas, avísame y te ayudo más** 🚀
