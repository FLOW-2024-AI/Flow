# Estándares de Color - Modo Día/Noche

## Backgrounds (Fondos)

### Fondo Principal
- **Día**: `bg-white`
- **Noche**: `bg-secondary-900`
- **Clase**: `bg-white dark:bg-secondary-900`

### Fondo Secundario (Cards, Modales)
- **Día**: `bg-gray-50` o `bg-gray-100`
- **Noche**: `bg-secondary-800`
- **Clase**: `bg-gray-50 dark:bg-secondary-800` o `bg-gray-100 dark:bg-secondary-800`

### Fondo Inputs
- **Día**: `bg-white`
- **Noche**: `bg-secondary-800`
- **Clase**: `bg-white dark:bg-secondary-800`

## Text (Texto)

### Texto Principal
- **Día**: `text-gray-900`
- **Noche**: `text-gray-100`
- **Clase**: `text-gray-900 dark:text-gray-100`

### Texto Secundario
- **Día**: `text-gray-600`
- **Noche**: `text-gray-300` o `text-gray-400`
- **Clase**: `text-gray-600 dark:text-gray-300`

### Texto en Inputs
- **Día**: `text-gray-900`
- **Noche**: `text-white`
- **Clase**: `text-gray-900 dark:text-white`

### Placeholders
- **Día**: `placeholder-gray-400`
- **Noche**: `placeholder-gray-500`
- **Clase**: `placeholder-gray-400 dark:placeholder-gray-500`

## Borders (Bordes)

### Bordes Principales
- **Día**: `border-gray-200`
- **Noche**: `border-gray-700`
- **Clase**: `border-gray-200 dark:border-gray-700`

### Bordes Secundarios
- **Día**: `border-gray-300`
- **Noche**: `border-gray-600`
- **Clase**: `border-gray-300 dark:border-gray-600`

## Links y Hover

### Links
- **Día**: `text-gray-600 hover:text-gray-900`
- **Noche**: `dark:text-gray-300 dark:hover:text-white`
- **Clase**: `text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white`

### Links con Primary
- **Día**: `text-primary-600 hover:text-primary-700`
- **Noche**: `dark:text-primary-400 dark:hover:text-primary-300`
- **Clase**: `text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300`

## Buttons

### Primary Button
- **Día**: `bg-primary-600 hover:bg-primary-700 text-white`
- **Noche**: `dark:bg-primary-600 dark:hover:bg-primary-700 dark:text-white`
- **Clase**: `bg-primary-600 hover:bg-primary-700 text-white`

### Secondary Button
- **Día**: `border-gray-300 text-gray-900 hover:border-primary-500`
- **Noche**: `dark:border-gray-700 dark:text-gray-100 dark:hover:border-primary-500`
- **Clase**: `border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-primary-500`

## NUNCA USAR

❌ `dark:text-gray-900` (invisible en modo noche)
❌ `dark:bg-white` (cegador en modo noche)
❌ Clases duplicadas como `dark:bg-secondary-800 dark:bg-secondary-800`
❌ `placeholder-neutral-500` (usar `placeholder-gray-400 dark:placeholder-gray-500`)
