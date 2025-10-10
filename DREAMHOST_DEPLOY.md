# 🚀 Guía de Despliegue a DreamHost - Flow Finance

## 📋 Pre-requisitos
- Cuenta de DreamHost activa
- Dominio configurado en DreamHost
- Acceso FTP/SFTP o SSH a tu hosting

---

## 🔧 Paso 1: Preparar el Build

Ya tienes el build generado en la carpeta `out/`. Si necesitas regenerarlo:

```bash
npm run build
```

---

## 📤 Paso 2: Subir Archivos a DreamHost

### Opción A: FTP/SFTP (Más Fácil)

1. **Descarga un cliente FTP** (si no tienes uno):
   - FileZilla (gratis): https://filezilla-project.org/
   - Cyberduck (gratis): https://cyberduck.io/

2. **Obtén tus credenciales de DreamHost**:
   - Ve a tu panel de DreamHost
   - Busca la sección "FTP/SFTP Users" o "Usuarios FTP"
   - Anota:
     - Host/Servidor: `ftp.tudominio.com` o similar
     - Usuario: tu usuario FTP
     - Contraseña: tu contraseña FTP
     - Puerto: 22 (SFTP) o 21 (FTP)

3. **Conecta con FileZilla**:
   - Abre FileZilla
   - Ingresa: Host, Usuario, Contraseña, Puerto
   - Click en "Conexión Rápida"

4. **Sube los archivos**:
   - En el panel izquierdo (tu computadora), navega a: `/Users/hugochavez/Documents/GitHub/finka-finance/out/`
   - En el panel derecho (DreamHost), navega a la carpeta de tu dominio (usualmente `~/tudominio.com/` o `~/public_html/`)
   - **IMPORTANTE**: Selecciona TODO el contenido DENTRO de la carpeta `out/` (no la carpeta `out/` misma)
   - Arrastra y suelta todos los archivos al servidor
   - Espera a que termine la transferencia

5. **Copia el archivo .htaccess**:
   - En tu computadora, copia el archivo `.htaccess.template` que está en la raíz del proyecto
   - Renómbralo a `.htaccess` (sin el .template)
   - Súbelo a la raíz de tu dominio en DreamHost (mismo lugar donde subiste los demás archivos)

### Opción B: SSH + Git (Avanzado)

Si tienes acceso SSH y prefieres usar Git:

```bash
# 1. Conéctate a DreamHost por SSH
ssh usuario@tudominio.com

# 2. Navega a la carpeta de tu dominio
cd ~/tudominio.com/

# 3. Clona el repositorio (si no lo has hecho)
git clone https://github.com/corevision1997/Flow.git temp_flow
cd temp_flow

# 4. Cambia a la branch dreamhost
git checkout dreamhost

# 5. Instala dependencias (si Node.js está disponible)
npm install

# 6. Genera el build
npm run build

# 7. Copia los archivos al directorio público
cp -r out/* ../
cd ..

# 8. Copia el .htaccess
cp .htaccess.template .htaccess

# 9. Limpia archivos temporales
rm -rf temp_flow
```

---

## ⚙️ Paso 3: Configurar el Dominio en DreamHost

1. **Ve al Panel de DreamHost**
2. **Navega a "Dominios" > "Manage Domains"**
3. **Encuentra tu dominio y haz click en "Edit"**
4. **Verifica que:**
   - "Web directory" apunte a la carpeta correcta (donde subiste los archivos)
   - "PHP" esté habilitado (aunque no lo uses, ayuda con .htaccess)
   - "Remove WWW" o "Add WWW" según tu preferencia

---

## 🔍 Paso 4: Verificar el Despliegue

1. Abre tu navegador
2. Ve a tu dominio: `https://tudominio.com`
3. Verifica que:
   - ✅ La página principal carga correctamente
   - ✅ Puedes navegar entre páginas (ej: /quienes-somos, /precios, /contacto)
   - ✅ Las imágenes y estilos cargan correctamente
   - ✅ No hay errores en la consola del navegador (F12)

---

## 🐛 Solución de Problemas

### Problema: "404 Not Found" al navegar entre páginas
**Solución**: Verifica que el archivo `.htaccess` esté en la raíz de tu dominio y que Apache mod_rewrite esté habilitado.

### Problema: Las imágenes no cargan
**Solución**: Verifica que la carpeta `_next/` y `images/` se hayan subido correctamente.

### Problema: Estilos CSS no se aplican
**Solución**: 
1. Limpia el caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
2. Verifica que la carpeta `_next/static/` se haya subido completamente

### Problema: "403 Forbidden"
**Solución**: 
1. Verifica los permisos de los archivos (deben ser 644 para archivos, 755 para carpetas)
2. En FileZilla: Click derecho > Permisos de archivo > 644 para archivos, 755 para carpetas

---

## 🔄 Actualizar el Sitio

Cuando hagas cambios:

```bash
# 1. Haz tus cambios en el código
# 2. Regenera el build
npm run build

# 3. Sube SOLO los archivos que cambiaron usando FTP
# O sube todo el contenido de out/ nuevamente
```

---

## 📝 Checklist Final

Antes de considerar el deployment completo:

- [ ] Todos los archivos de `out/` están en el servidor
- [ ] El archivo `.htaccess` está en la raíz del dominio
- [ ] La página principal carga en `https://tudominio.com`
- [ ] La navegación entre páginas funciona
- [ ] Las imágenes y estilos cargan correctamente
- [ ] No hay errores 404 en la consola del navegador
- [ ] El sitio funciona en móvil y desktop

---

## 📞 Contacto de Soporte

Si tienes problemas:
1. Revisa los logs de error en DreamHost Panel > "Goodies" > "Error Logs"
2. Contacta al soporte de DreamHost si el problema persiste
3. Verifica la documentación de DreamHost: https://help.dreamhost.com/

---

## 🎉 ¡Listo!

Tu sitio Flow Finance debería estar ahora en vivo en DreamHost.
