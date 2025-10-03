# Finka Finance - Landing Page

Landing page minimalista para Finka Finance con tema oscuro, integración con Supabase y notificaciones webhook a n8n.

## Stack Tecnológico

- **Next.js 14** (App Router) + React + TypeScript
- **TailwindCSS** (tema monocromo: negro/blanco/grises)
- **Framer Motion** (animaciones suaves)
- **Supabase** (base de datos para leads)
- **API interna** para notificaciones webhook a n8n

## Características

- ✅ Diseño minimalista estilo Apple/OpenAI
- ✅ Tema oscuro completo (fondo negro, texto blanco)
- ✅ Animaciones suaves con Framer Motion
- ✅ Formulario de leads con validación
- ✅ Integración con Supabase
- ✅ Notificaciones automáticas a n8n
- ✅ Responsive design
- ✅ Accesibilidad (focus rings, labels, aria)
- ✅ SEO optimizado
- ✅ Contenido 100% en español

## Configuración de Supabase

### 1. Crear tabla de leads

Ejecuta el siguiente SQL en el SQL Editor de Supabase:

```sql
-- Asegurar extensión pgcrypto si aplica (para gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  company text,
  role text,
  nombre text,
  apellido text,
  telefono text,
  empleados text,
  procesos text,
  mensaje text,
  tipo text DEFAULT 'lead',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Política simple para permitir inserts desde anon
DROP POLICY IF EXISTS anon_insert_leads ON public.leads;
CREATE POLICY anon_insert_leads ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

### 2. Variables de entorno

Crea un archivo `.env.local` con las siguientes variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# n8n Webhook Configuration
N8N_WEBHOOK_URL=tu_webhook_url_de_n8n
```

## Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Despliegue en Vercel

### 1. Configurar variables de entorno en Vercel

En el dashboard de Vercel, configura las siguientes variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `N8N_WEBHOOK_URL`

### 2. Desplegar

```bash
# Conectar con Vercel CLI (opcional)
npx vercel

# O simplemente hacer push al repositorio conectado
git push origin main
```

## Estructura del Proyecto

```
finka-finance/
├── app/
│   ├── api/
│   │   └── notify/
│   │       └── route.ts          # API para webhook n8n
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página principal
├── components/
│   └── CTAForm.tsx               # Formulario de leads
├── lib/
│   └── supabaseClient.ts         # Cliente de Supabase
├── public/                       # Archivos estáticos
├── .env.example                  # Ejemplo de variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Funcionalidades del Formulario

### Flujo de registro:
1. Usuario completa formulario (email obligatorio)
2. Validación en frontend
3. Inserción en tabla `leads` de Supabase
4. Notificación automática a webhook de n8n
5. Mensaje de confirmación al usuario

### Estados del formulario:
- **Loading**: Botón deshabilitado con spinner
- **Éxito**: Tarjeta verde con mensaje de confirmación
- **Error**: Mensaje de error en rojo

## Secciones de la Landing

1. **Navegación**: Logo, links de navegación, botón CTA
2. **Hero**: Título principal, subtítulo, botones de acción
3. **Integraciones**: Chips con tecnologías compatibles
4. **Características**: 3 tarjetas con features principales
5. **Cómo funciona**: 3 pasos del proceso
6. **CTA**: Formulario de registro para beta
7. **Footer**: Copyright y links legales

## Animaciones

- **Fade-in**: Elementos aparecen desde Y=12px
- **Stagger**: Animaciones secuenciales con delay 0.12s
- **Hover**: Tarjetas se elevan 4px en hover
- **Loading**: Spinner en botón durante envío

## Accesibilidad

- Focus rings visibles en elementos interactivos
- Labels apropiados en formularios
- Navegación por teclado
- Contraste adecuado (WCAG AA)
- Texto alternativo en imágenes

## Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

## Licencia

© 2025 Finka Finance. Todos los derechos reservados.
