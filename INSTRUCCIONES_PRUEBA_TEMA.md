# 🧪 Instrucciones para Probar el Tema Automático

## ⚠️ IMPORTANTE: Limpiar localStorage Primero

Antes de probar, **DEBES** limpiar el localStorage antiguo:

### Opción 1: Desde la Consola del Navegador
```javascript
// Abre la consola (F12 o Cmd+Option+I)
localStorage.removeItem('theme')
localStorage.removeItem('theme_user_preference')
// Luego recarga la página
location.reload()
```

### Opción 2: Desde DevTools
1. Abre DevTools (F12 o Cmd+Option+I)
2. Ve a la pestaña "Application" o "Almacenamiento"
3. En el menú izquierdo, expande "Local Storage"
4. Haz clic en tu dominio
5. Elimina las claves `theme` y `theme_user_preference`
6. Recarga la página

---

## ✅ Cómo Probar la Detección Automática

### 1. Detección Inicial del Sistema

**Mac:**
```
1. Limpia localStorage (ver arriba)
2. Cambia el tema del sistema:
   Preferencias del Sistema → Apariencia → Claro/Oscuro
3. Abre el sitio web
4. ✅ Debería mostrar el tema del sistema automáticamente
```

**Windows:**
```
1. Limpia localStorage (ver arriba)
2. Cambia el tema del sistema:
   Configuración → Personalización → Colores → Claro/Oscuro
3. Abre el sitio web
4. ✅ Debería mostrar el tema del sistema automáticamente
```

### 2. Cambio en Tiempo Real

**Sin haber usado el toggle:**
```
1. Limpia localStorage
2. Abre el sitio web
3. Deja el sitio abierto
4. Cambia el tema del sistema (Mac/Windows)
5. ✅ El sitio debería cambiar automáticamente en 1-2 segundos
```

### 3. Toggle Manual

**Después de usar el botón:**
```
1. Limpia localStorage
2. Abre el sitio web (usa tema del sistema)
3. Haz clic en el botón sol/luna
4. ✅ El tema cambia manualmente
5. Cambia el tema del sistema
6. ✅ El sitio NO debería cambiar (respeta tu elección manual)
7. Recarga la página
8. ✅ Mantiene tu elección manual
```

### 4. Volver a Detección Automática

**Para volver al modo automático:**
```javascript
// En la consola del navegador:
localStorage.removeItem('theme')
localStorage.removeItem('theme_user_preference')
location.reload()
// Ahora volverá a seguir el tema del sistema
```

---

## 🔍 Verificación de Estado

### Ver el Estado Actual
```javascript
// En la consola del navegador:
console.log('Tema guardado:', localStorage.getItem('theme'))
console.log('Preferencia de usuario:', localStorage.getItem('theme_user_preference'))
console.log('Tema del sistema:', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
console.log('Clase dark en HTML:', document.documentElement.classList.contains('dark'))
```

### Estados Esperados

**Modo Automático (sin preferencia manual):**
```
theme: null o "light"/"dark"
theme_user_preference: null
Sigue el tema del sistema
```

**Modo Manual (después de usar el toggle):**
```
theme: "light" o "dark"
theme_user_preference: "true"
NO sigue el tema del sistema
```

---

## 🐛 Solución de Problemas

### Problema: No detecta el tema del sistema
**Solución:**
```javascript
// 1. Limpia localStorage
localStorage.clear()

// 2. Verifica que el navegador soporte matchMedia
console.log(window.matchMedia('(prefers-color-scheme: dark)').matches)

// 3. Recarga la página
location.reload()
```

### Problema: Siempre está en modo oscuro/claro
**Solución:**
```javascript
// Limpia la preferencia manual
localStorage.removeItem('theme_user_preference')
localStorage.removeItem('theme')
location.reload()
```

### Problema: No cambia en tiempo real
**Solución:**
```javascript
// Verifica que no tengas preferencia manual
console.log(localStorage.getItem('theme_user_preference'))
// Si dice "true", límpialo:
localStorage.removeItem('theme_user_preference')
location.reload()
```

---

## 📊 Checklist de Pruebas

### Detección Automática
- [ ] Limpiado localStorage
- [ ] Sistema en modo claro → Sitio en modo claro
- [ ] Sistema en modo oscuro → Sitio en modo oscuro
- [ ] Cambio de sistema → Sitio cambia automáticamente

### Toggle Manual
- [ ] Clic en botón → Tema cambia
- [ ] Recarga página → Mantiene elección
- [ ] Cambio de sistema → NO afecta el sitio
- [ ] localStorage tiene `theme_user_preference: "true"`

### Volver a Automático
- [ ] Limpiado localStorage
- [ ] Sitio vuelve a seguir el sistema
- [ ] Cambios del sistema se reflejan en tiempo real

---

## 🎯 Comportamiento Esperado

### Primera Visita (sin localStorage)
```
1. Usuario abre el sitio
2. Sistema detecta tema del OS
3. Aplica tema automáticamente
4. NO guarda en localStorage
5. Sigue cambios del sistema en tiempo real
```

### Después de Usar el Toggle
```
1. Usuario hace clic en sol/luna
2. Tema cambia manualmente
3. Guarda en localStorage con flag `theme_user_preference: true`
4. YA NO sigue el sistema automáticamente
5. Mantiene la elección del usuario
```

### Para Resetear
```
1. Usuario limpia localStorage
2. O elimina `theme_user_preference`
3. Sitio vuelve a modo automático
4. Sigue el sistema nuevamente
```

---

## 🌐 URLs para Probar

**GitHub Pages:**
- https://corevision1997.github.io/Flow/

**DreamHost (cuando se actualice):**
- https://flow-cfo.com/

**Local:**
```bash
npm run dev
# http://localhost:3000
```

---

## 💡 Tips

1. **Siempre limpia localStorage** antes de probar la detección automática
2. **Usa la consola** para ver el estado actual
3. **Prueba en diferentes navegadores** (Chrome, Safari, Firefox)
4. **Prueba en móvil** también
5. **Verifica que no haya errores** en la consola

---

**Última actualización**: 2025-10-10 01:38  
**Versión**: 2.0 - Con flag de preferencia de usuario
