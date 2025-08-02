#!/bin/bash

# Script de deploy Firebase para UniOvi Monitor
# Uso: ./deploy-firebase.sh [opção]

echo "🔥 Firebase Deploy - UniOvi Monitor"
echo "==================================="

# Verificar se Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI não encontrado!"
    echo "📦 Instalando Firebase CLI..."
    npm install -g firebase-tools
fi

case "$1" in
    "setup")
        echo "🔧 Configurando Firebase..."
        firebase login
        firebase init hosting
        ;;
    "serve")
        echo "🚀 Iniciando servidor local Firebase..."
        firebase serve --only hosting --port 8000
        ;;
    "deploy")
        echo "☁️ Deployando para Firebase..."
        firebase deploy --only hosting
        ;;
    "deploy:prod")
        echo "🚀 Deployando para produção..."
        firebase deploy --only hosting --project uniovi-monitor
        ;;
    "status")
        echo "📊 Status do projeto Firebase..."
        firebase projects:list
        firebase hosting:sites:list
        ;;
    "logs")
        echo "📋 Logs do Firebase..."
        firebase hosting:channel:list
        ;;
    *)
        echo "Opções disponíveis:"
        echo "  ./deploy-firebase.sh setup      - Configurar Firebase"
        echo "  ./deploy-firebase.sh serve      - Servidor local"
        echo "  ./deploy-firebase.sh deploy     - Deploy para staging"
        echo "  ./deploy-firebase.sh deploy:prod - Deploy para produção"
        echo "  ./deploy-firebase.sh status     - Status do projeto"
        echo "  ./deploy-firebase.sh logs       - Ver logs"
        echo ""
        echo "💡 Para deploy rápido: ./deploy-firebase.sh deploy"
        ;;
esac 