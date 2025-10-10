# 🎨 Instrucciones para el Sistema de Temas

## ✅ Qué se ha implementado

### 1. Detección Automática del Tema del Sistema
Tu sitio web ahora detecta automáticamente si tu Mac o Windows está en modo oscuro o claro y se adapta al instante.

**Cómo funciona:**
- Primera vez que visitas: Usa el tema de tu sistema operativo
- Si cambias manualmente el tema: Guarda tu preferencia
- Si cambias el tema del sistema: Se actualiza automáticamente (solo si no has elegido manualmente)

### 2. Todos los Colores Corregidos
- ✅ Todos los textos son legibles en ambos modos
- ✅ Todos los fondos se adaptan correctamente
- ✅ Todos los bordes tienen buen contraste
- ✅ Todos los placeholders son visibles
- ✅ No hay elementos transparentes problemáticos

## 🧪 Cómo Probar

### Opción 1: Cambiar el tema del sistema (Mac)
1. Abre **Preferencias del Sistema** → **Apariencia**
2. Cambia entre "Claro" y "Oscuro"
3. Abre tu sitio web → Debería cambiar automáticamente

### Opción 2: Cambiar el tema del sistema (Windows)
1. Abre **Configuración** → **Personalización** → **Colores**
2. Cambia entre "Claro" y "Oscuro"
3. Abre tu sitio web → Debería cambiar automáticamente

### Opción 3: Usar el botón de tema
1. Haz clic en el botón de sol/luna en el Navbar
2. El tema cambia instantáneamente
3. Recarga la página → Mantiene tu elección

## 📱 Qué Verificar

### Modo Día (Claro)
- [ ] Fondo principal: Blanco
- [ ] Texto principal: Negro/Gris oscuro
- [ ] Cards: Gris muy claro
- [ ] Bordes: Gris claro
- [ ] Botones primarios: Azul con texto blanco
- [ ] Links: Gris que se vuelve negro al hover

### Modo Noche (Oscuro)
- [ ] Fondo principal: Gris muy oscuro
- [ ] Texto principal: Blanco/Gris claro
- [ ] Cards: Gris oscuro
- [ ] Bordes: Gris medio
- [ ] Botones primarios: Azul con texto blanco
- [ ] Links: Gris claro que se vuelve blanco al hover

## 🔧 Para Desarrolladores

### Agregar Nuevos Componentes

Cuando crees nuevos componentes, usa estos patrones:

```tsx
// ✅ CORRECTO - Fondo principal
className="bg-white dark:bg-secondary-900"

// ✅ CORRECTO - Fondo de card
className="bg-gray-50 dark:bg-secondary-800"

// ✅ CORRECTO - Texto principal
className="text-gray-900 dark:text-gray-100"

// ✅ CORRECTO - Texto secundario
className="text-gray-600 dark:text-gray-400"

// ✅ CORRECTO - Bordes
className="border-gray-200 dark:border-gray-700"

// ✅ CORRECTO - Placeholders
className="placeholder-gray-400 dark:placeholder-gray-500"

// ❌ INCORRECTO - No usar
className="bg-neutral-900"  // No se adapta al tema
className="text-white"      // Invisible en modo claro
className="dark:text-gray-900"  // Invisible en modo oscuro
```

### Referencia Completa
Ver `COLOR_STANDARDS.md` para todos los estándares de color.

## 🚀 Deployment

### Para GitHub Pages
```bash
git add -A
git commit -m "fix: Corregir sistema de temas día/noche"
git push origin main
```

### Para DreamHost
```bash
git checkout dreamhost
git merge main
npm run build
# Subir carpeta /out con FileZilla
git push origin dreamhost
```

## 🐛 Solución de Problemas

### El tema no cambia automáticamente
1. Limpia el localStorage: `localStorage.clear()`
2. Recarga la página
3. Debería detectar el tema del sistema

### Algunos elementos no se ven bien
1. Verifica que uses las clases de `COLOR_STANDARDS.md`
2. Evita colores hardcodeados como `text-white` o `bg-black`
3. Siempre usa variantes `dark:` para modo oscuro

### El tema no se guarda
1. Verifica que el navegador permita localStorage
2. Revisa la consola por errores
3. El ThemeContext debería guardar automáticamente

## 📚 Archivos Importantes

- `contexts/ThemeContext.tsx` - Lógica del tema
- `components/ThemeToggle.tsx` - Botón de cambio
- `tailwind.config.ts` - Configuración de colores
- `COLOR_STANDARDS.md` - Guía de colores
- `THEME_FIXES_SUMMARY.md` - Resumen de cambios

## 💡 Tips

1. **Siempre prueba en ambos modos** antes de hacer commit
2. **Usa el inspector** para verificar que las clases dark: se apliquen
3. **Mantén consistencia** usando los estándares de COLOR_STANDARDS.md
4. **No uses colores absolutos** como `text-white` o `bg-black` directamente

---

**¿Preguntas?** Revisa `THEME_FIXES_SUMMARY.md` para más detalles técnicos.
