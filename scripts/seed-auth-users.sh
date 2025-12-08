#!/bin/bash
# Script para crear usuarios de prueba en el emulador de Firebase Auth
# Ejecutar después de iniciar: firebase emulators:start
#
# Los usuarios creados aparecerán en el popup de login de Google del emulador
# Usa signInWithIdp para simular login real con Google

EMULATOR_HOST="http://127.0.0.1:9099"
# IMPORTANTE: Este debe coincidir con el projectId usado en el frontend
# El emulador genera tokens con este audience
PROJECT_ID="authzen-gma61"

echo "🔐 Creando usuarios de prueba en Firebase Auth Emulator..."
echo ""

# Limpiar usuarios existentes primero
echo "  🗑️  Limpiando usuarios existentes..."
curl -s -X DELETE "${EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}/accounts" > /dev/null 2>&1

# Función para crear usuario con Google Sign-In real
create_google_user() {
    local google_id=$1
    local email=$2
    local name=$3
    local role=$4
    
    echo "  → Creando: $name ($email) - Rol: $role"
    
    # Usar signInWithIdp para simular login real con Google
    response=$(curl -s -X POST "${EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=fake-api-key" \
        -H "Content-Type: application/json" \
        -d "{
            \"postBody\": \"id_token={\\\"sub\\\":\\\"${google_id}\\\",\\\"email\\\":\\\"${email}\\\",\\\"email_verified\\\":true,\\\"name\\\":\\\"${name}\\\"}&providerId=google.com\",
            \"requestUri\": \"http://localhost\",
            \"returnIdpCredential\": true,
            \"returnSecureToken\": true
        }" 2>&1)
    
    # Extraer localId
    localId=$(echo "$response" | grep -o '"localId":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -n "$localId" ]; then
        # Agregar custom claims (rol) al usuario
        # El backend espera claims como: admin=true, dirigente=true, padre=true
        local claims=""
        case $role in
            ADMIN)
                claims='{\"admin\":true,\"dirigente\":false,\"padre\":false}'
                ;;
            DIRIGENTE)
                claims='{\"admin\":false,\"dirigente\":true,\"padre\":false}'
                ;;
            PADRE)
                claims='{\"admin\":false,\"dirigente\":false,\"padre\":true}'
                ;;
            *)
                claims='{\"admin\":false,\"dirigente\":false,\"padre\":false}'
                ;;
        esac
        
        curl -s -X POST "${EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:update" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer owner" \
            -d "{
                \"localId\": \"${localId}\",
                \"customAttributes\": \"${claims}\"
            }" > /dev/null 2>&1
        echo "    ✓ Creado con UID: $localId (claims: $role)"
    else
        echo "    ✗ Error: $response"
    fi
}

# Crear los 4 usuarios de prueba
create_google_user "google-admin-001" "admin@test.cas.com" "👑 Admin CAS" "ADMIN"
create_google_user "google-dirigente-001" "dirigente@test.cas.com" "🏕️ Dirigente CAS" "DIRIGENTE"
create_google_user "google-padre-001" "padre@test.cas.com" "👨‍👩‍👧 Padre CAS" "PADRE"
create_google_user "google-acampante-001" "acampante@test.cas.com" "🎒 Acampante CAS" "ACAMPANTE"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  📋 Usuarios disponibles en el popup de Google Sign-In:"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "  👑 admin@test.cas.com        - Rol: ADMIN"
echo "  🏕️  dirigente@test.cas.com   - Rol: DIRIGENTE"
echo "  👨‍👩‍👧 padre@test.cas.com        - Rol: PADRE"
echo "  🎒 acampante@test.cas.com    - Rol: ACAMPANTE"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  🔗 Consola Auth Emulator: http://127.0.0.1:4000/auth"
echo "════════════════════════════════════════════════════════════════"
