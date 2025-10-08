#!/bin/bash

# Flow Finance - DreamHost Deployment Script
# Este script prepara los archivos para subir a DreamHost

echo "🚀 Flow Finance - Preparando deployment para DreamHost"
echo "=================================================="
echo ""

# Verificar que estamos en la branch correcta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "dreamhost" ]; then
    echo "⚠️  Advertencia: No estás en la branch 'dreamhost'"
    echo "Branch actual: $CURRENT_BRANCH"
    echo ""
    read -p "¿Quieres cambiar a la branch dreamhost? (s/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        git checkout dreamhost
        echo "✅ Cambiado a branch dreamhost"
    else
        echo "❌ Cancelando deployment"
        exit 1
    fi
fi

echo "📦 Generando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build generado exitosamente"
else
    echo "❌ Error al generar el build"
    exit 1
fi

echo ""
echo "📋 Copiando archivo .htaccess..."
if [ -f ".htaccess.template" ]; then
    cp .htaccess.template out/.htaccess
    echo "✅ Archivo .htaccess copiado a out/"
else
    echo "⚠️  Advertencia: No se encontró .htaccess.template"
fi

echo ""
echo "✅ ¡Preparación completa!"
echo ""
echo "📤 Próximos pasos:"
echo "1. Abre tu cliente FTP (FileZilla, Cyberduck, etc.)"
echo "2. Conecta a tu servidor DreamHost"
echo "3. Navega a la carpeta de tu dominio (ej: ~/tudominio.com/)"
echo "4. Sube TODO el contenido de la carpeta 'out/' a tu servidor"
echo "5. Verifica que el archivo .htaccess se haya subido"
echo ""
echo "📖 Para instrucciones detalladas, lee: DREAMHOST_DEPLOY.md"
echo ""
echo "🌐 Ubicación de archivos a subir: $(pwd)/out/"
echo ""
