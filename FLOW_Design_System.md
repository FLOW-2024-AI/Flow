# 🎨 FLOW - Sistema de Diseño Completo

## Paleta de Colores

### Colores Base
| Nombre | Clase Tailwind | Hex | RGB | Uso |
|--------|---------------|-----|-----|-----|
| Background Principal | `black` | `#000000` | `rgb(0, 0, 0)` | Fondo principal del sitio |
| Background Secundario | `neutral-950` | `#0a0a0a` | `rgb(10, 10, 10)` | Fondo de secciones |
| Text Principal | `white` | `#FFFFFF` | `rgb(255, 255, 255)` | Texto principal |
| Text Secundario | `neutral-400` | `#A3A3A3` | `rgb(163, 163, 163)` | Texto secundario |
| Text Terciario | `neutral-500` | `#737373` | `rgb(115, 115, 115)` | Texto terciario |

### Azul (Tecnología/Confianza)
| Nombre | Clase Tailwind | Hex | RGB |
|--------|---------------|-----|-----|
| Blue 400 | `blue-400` | `#60A5FA` | `rgb(96, 165, 250)` |
| Blue 500 | `blue-500` | `#3B82F6` | `rgb(59, 130, 246)` |
| Blue 600 | `blue-600` | `#2563EB` | `rgb(37, 99, 235)` |
| Blue 900/20 | `blue-900/20` | `rgba(30, 58, 138, 0.2)` | Transparente |

### Púrpura (Innovación/IA)
| Nombre | Clase Tailwind | Hex | RGB |
|--------|---------------|-----|-----|
| Purple 400 | `purple-400` | `#C084FC` | `rgb(192, 132, 252)` |
| Purple 500 | `purple-500` | `#A855F7` | `rgb(168, 85, 247)` |
| Purple 600 | `purple-600` | `#9333EA` | `rgb(147, 51, 234)` |
| Purple 900/20 | `purple-900/20` | `rgba(88, 28, 135, 0.2)` | Transparente |

### Verde (Éxito/Crecimiento)
| Nombre | Clase Tailwind | Hex | RGB |
|--------|---------------|-----|-----|
| Green 400 | `green-400` | `#4ADE80` | `rgb(74, 222, 128)` |
| Green 500 | `green-500` | `#22C55E` | `rgb(34, 197, 94)` |
| Green 600 | `green-600` | `#16A34A` | `rgb(22, 163, 74)` |
| Emerald 600 | `emerald-600` | `#059669` | `rgb(5, 150, 105)` |

### Naranja/Rojo (Financiero/Alertas)
| Nombre | Clase Tailwind | Hex | RGB |
|--------|---------------|-----|-----|
| Orange 500 | `orange-500` | `#F97316` | `rgb(249, 115, 22)` |
| Red 600 | `red-600` | `#DC2626` | `rgb(220, 38, 38)` |
| Pink 400 | `pink-400` | `#F472B6` | `rgb(244, 114, 182)` |

### Neutrales (UI)
| Nombre | Clase Tailwind | Hex | RGB |
|--------|---------------|-----|-----|
| Neutral 700 | `neutral-700` | `#404040` | `rgb(64, 64, 64)` |
| Neutral 800 | `neutral-800` | `#262626` | `rgb(38, 38, 38)` |
| Neutral 900 | `neutral-900` | `#171717` | `rgb(23, 23, 23)` |
| Neutral 950 | `neutral-950` | `#0a0a0a` | `rgb(10, 10, 10)` |

---

## Gradientes

### Gradiente Hero Principal
```css
background: linear-gradient(to right, #60A5FA, #C084FC, #60A5FA);
/* from-blue-400 via-purple-400 to-blue-400 */
```

### Gradiente Hero Secundario
```css
background: linear-gradient(to right, #60A5FA, #C084FC, #F472B6);
/* from-blue-400 via-purple-400 to-pink-400 */
```

### Gradiente CTA Background
```css
background: linear-gradient(to bottom right, 
  rgba(30, 58, 138, 0.2), 
  rgba(88, 28, 135, 0.2), 
  rgba(190, 24, 93, 0.2)
);
/* from-blue-900/20 via-purple-900/20 to-pink-900/20 */
```

### Gradiente Card Hover
```css
background: linear-gradient(to bottom right, #3B82F6, #9333EA);
/* from-blue-500 to-purple-600 */
```

---

## 📝 Tipografía

### Font Family
```css
font-family: "Myriad Pro", "Myriad", "Liberation Sans", "Nimbus Sans L", 
             "Helvetica Neue", Arial, sans-serif;
```

### Tamaños de Texto

| Elemento | Clase Tailwind | Tamaño Desktop | Tamaño Mobile |
|----------|---------------|----------------|---------------|
| H1 Hero | `text-4xl md:text-6xl` | 60px | 36px |
| H2 Section | `text-3xl md:text-4xl` | 36px | 30px |
| H3 Card | `text-xl md:text-2xl` | 24px | 20px |
| H4 Subsection | `text-lg` | 18px | 18px |
| Body Large | `text-xl` | 20px | 20px |
| Body Base | `text-base` | 16px | 16px |
| Body Small | `text-sm` | 14px | 14px |
| Body XSmall | `text-xs` | 12px | 12px |

### Font Weights

| Nombre | Clase Tailwind | Valor | Uso |
|--------|---------------|-------|-----|
| Bold | `font-bold` | 700 | Títulos importantes |
| Semibold | `font-semibold` | 600 | Subtítulos |
| Medium | `font-medium` | 500 | Texto destacado |
| Regular | `font-normal` | 400 | Texto normal |

### Line Heights

| Nombre | Clase Tailwind | Valor | Uso |
|--------|---------------|-------|-----|
| Tight | `leading-tight` | 1.25 | Títulos |
| Normal | `leading-normal` | 1.5 | Texto normal |
| Relaxed | `leading-relaxed` | 1.625 | Párrafos largos |

---

## 🎭 Efectos y Sombras

### Shadows
```css
/* Shadow XL */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* Shadow 2XL */
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Shadow Blue (Glow) */
box-shadow: 0 0 50px rgba(59, 130, 246, 0.2);
```

### Backdrop Effects
```css
/* Backdrop Blur */
backdrop-filter: blur(24px);

/* Background with Opacity */
background-color: rgba(0, 0, 0, 0.95);
```

### Borders
```css
/* Border Neutral */
border: 1px solid #262626;

/* Border Blue */
border: 1px solid rgba(59, 130, 246, 0.3);

/* Border Hover */
border: 1px solid #404040;
```

---

## 🔘 Componentes

### Buttons

#### Primary Button
```css
background-color: #FFFFFF;
color: #000000;
padding: 1rem 2rem;
border-radius: 9999px;
font-weight: 700;

/* Hover */
opacity: 0.9;
```

#### Secondary Button
```css
background-color: transparent;
color: #FFFFFF;
border: 1px solid #404040;
padding: 1rem 2rem;
border-radius: 9999px;
font-weight: 500;

/* Hover */
background-color: rgba(23, 23, 23, 0.5);
border-color: #404040;
```

### Cards
```css
background-color: rgba(23, 23, 23, 0.5);
border: 1px solid #262626;
border-radius: 16px;
padding: 2rem;

/* Hover */
border-color: #404040;
```

### Inputs
```css
background-color: #000000;
border: 1px solid #404040;
border-radius: 12px;
padding: 0.75rem 1rem;
color: #FFFFFF;

/* Focus */
outline: 2px solid #3B82F6;
outline-offset: 2px;
```

---

## 📐 Espaciado

### Padding/Margin Scale
- `p-1` = 4px
- `p-2` = 8px
- `p-3` = 12px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px
- `p-12` = 48px
- `p-16` = 64px
- `p-20` = 80px

### Border Radius
- `rounded-xl` = 12px
- `rounded-2xl` = 16px
- `rounded-3xl` = 24px
- `rounded-full` = 9999px

---

## 🎯 Uso de Colores por Contexto

### CTAs y Acciones
- **Primary Action:** White background, Black text
- **Secondary Action:** Transparent with border
- **Success:** Green 400
- **Warning:** Orange 500
- **Error:** Red 600

### Estados
- **Hover:** Opacity 90% o background change
- **Active:** Border color change
- **Disabled:** Opacity 50%
- **Focus:** Blue 500 outline

### Secciones
- **Hero:** Gradiente Blue-Purple-Blue
- **Features:** Neutral 900/50 background
- **CTA Sections:** Gradiente Blue-Purple-Pink con opacity
- **Footer:** Neutral 950 background

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

---

## ✨ Animaciones

### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

**Versión:** 1.0  
**Última actualización:** Octubre 2024  
**Proyecto:** Flow - Automatización Financiera con IA
