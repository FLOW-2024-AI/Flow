# Guía de Actualización de Tema - Flow Finance

## 🎨 Paleta de Colores

### Modo Claro (Light Mode)
- **Fondo principal**: `bg-white`
- **Fondo secundario**: `bg-gray-50`
- **Texto principal**: `text-gray-900`
- **Texto secundario**: `text-gray-600`
- **Bordes**: `border-gray-200` / `border-gray-300`
- **Hover backgrounds**: `hover:bg-gray-50`

### Modo Oscuro (Dark Mode)
- **Fondo principal**: `dark:bg-secondary-900` (#0f172a)
- **Fondo secundario**: `dark:bg-secondary-800` (#1e293b)
- **Texto principal**: `dark:text-gray-100`
- **Texto secundario**: `dark:text-gray-400`
- **Bordes**: `dark:border-gray-800` / `dark:border-gray-700`
- **Hover backgrounds**: `dark:hover:bg-secondary-800`

### Colores Primarios (Azul Financiero)
- **primary-50**: #eff6ff (muy claro)
- **primary-500**: #3b82f6 (principal)
- **primary-600**: #2563eb (hover)
- **primary-700**: #1d4ed8 (activo)

## 🔄 Patrón de Reemplazo

### Fondos
```
bg-black → bg-white dark:bg-secondary-900
bg-neutral-900 → bg-gray-50 dark:bg-secondary-800
bg-neutral-800 → bg-gray-100 dark:bg-secondary-700
```

### Textos
```
text-white → text-gray-900 dark:text-gray-100
text-neutral-400 → text-gray-600 dark:text-gray-400
text-neutral-300 → text-gray-700 dark:text-gray-300
```

### Bordes
```
border-neutral-800 → border-gray-200 dark:border-gray-800
border-neutral-700 → border-gray-300 dark:border-gray-700
border-white/10 → border-gray-200 dark:border-gray-800
```

### Botones Primarios
```
bg-white text-black → bg-primary-600 hover:bg-primary-700 text-white
bg-blue-600 → bg-primary-600 hover:bg-primary-700
```

### Gradientes
```
from-blue-400 to-purple-400 → from-primary-600 via-primary-500 to-primary-600
bg-blue-500/10 → bg-primary-50 dark:bg-primary-500/10
```

## 📝 Componentes Actualizados

- ✅ ThemeContext
- ✅ ThemeToggle
- ✅ Navbar
- ✅ Layout (RootLayout)
- ✅ Página principal (parcial)
- ⏳ Dashboard
- ⏳ Login
- ⏳ Otras páginas

## 🚀 Uso del Toggle de Tema

El toggle de tema está disponible en el Navbar. Los usuarios pueden cambiar entre modo claro y oscuro, y la preferencia se guarda en localStorage.

## 💡 Notas Importantes

1. Siempre incluir `transition-colors duration-200` para transiciones suaves
2. Usar `dark:` prefix para estilos de modo oscuro
3. Los colores primarios (azul) son consistentes en ambos modos
4. El logo SVG funciona en ambos modos
