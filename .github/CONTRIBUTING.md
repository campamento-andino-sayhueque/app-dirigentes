# 🛡️ Reglas de Contribución - CAS

## 📋 Antes de Contribuir

### Requisitos Obligatorios
- [ ] Firebase CLI instalado y configurado
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Emuladores de Firebase funcionando localmente
- [ ] Conocimiento del flujo de trabajo con ramas

## 🔄 Proceso de Contribución

### 1. ⚠️ REGLA DE ORO: Firebase Console Local
```bash
# SIEMPRE antes de desarrollar
firebase emulators:start
```
**No desarrolles sin los emuladores corriendo**

### 2. 🌿 Creación de Rama
```bash
# Desde dev (NUNCA desde main)
git checkout dev
git pull origin dev
git checkout -b [tipo]/[descripcion-corta]
```

**Tipos de rama permitidos:**
- `feature/` - Nueva funcionalidad
- `bugfix/` - Corrección de bug
- `hotfix/` - Corrección crítica
- `refactor/` - Refactorización de código
- `docs/` - Documentación

**Ejemplos válidos:**
- `feature/google-login`
- `bugfix/auth-redirect-error`
- `hotfix/security-vulnerability`

### 3. 💻 Desarrollo

#### Comandos Obligatorios Antes de Codificar:
```bash
# Terminal 1: Emuladores Firebase
firebase emulators:start

# Terminal 2: Next.js
cd cas
npm run dev
```

#### URLs de Desarrollo:
- Aplicación: http://localhost:3000
- Firebase UI: http://localhost:4000
- Auth Emulator: http://localhost:9099
- Firestore Emulator: http://localhost:8080

### 4. ✅ Testing Local (OBLIGATORIO)

Antes de hacer commit:

```bash
# 1. Build exitoso
npm run build

# 2. Sin errores de linting
npm run lint

# 3. Funcionalidad probada en Firebase Console
# Accede a http://localhost:4000 y verifica tu funcionalidad

# 4. No hay errores en consola del navegador
```

### 5. 📝 Commits

#### Formato de Mensaje:
```
tipo(alcance): descripción corta

Descripción detallada opcional.

Closes #123
```

#### Tipos Permitidos:
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `style:` - Cambios de formato (sin lógica)
- `refactor:` - Refactorización
- `test:` - Añadir tests
- `chore:` - Tareas de mantenimiento

#### Ejemplos:
```bash
git commit -m "feat(auth): agregar login con Google"
git commit -m "fix(ui): corregir responsive en mobile"
git commit -m "docs(readme): actualizar instrucciones de setup"
```

### 6. 🔀 Pull Request

#### Antes de crear PR:
- [ ] Código probado localmente
- [ ] Build exitoso
- [ ] Sin errores de linting
- [ ] Funcionalidad verificada en Firebase Console
- [ ] Commits con mensajes claros

#### Información Requerida en PR:

**Plantilla de PR:**
```markdown
## 📋 Descripción
Breve descripción de los cambios realizados.

## 🔄 Tipo de Cambio
- [ ] Nueva funcionalidad (feature)
- [ ] Corrección de bug (bugfix)
- [ ] Corrección crítica (hotfix)
- [ ] Refactorización (refactor)
- [ ] Documentación (docs)

## ✅ Checklist
- [ ] Código probado localmente con Firebase emulators
- [ ] Build exitoso (`npm run build`)
- [ ] Sin errores de linting (`npm run lint`)
- [ ] Funcionalidad verificada en Firebase Console (http://localhost:4000)
- [ ] Variables de entorno verificadas
- [ ] Documentación actualizada (si aplica)

## 🧪 Pruebas Realizadas
Describe cómo probaste tu funcionalidad:
- [ ] Prueba 1: ...
- [ ] Prueba 2: ...

## 📸 Screenshots (si aplica)
Adjunta capturas de pantalla si hay cambios visuales.

## 🔗 Issues Relacionados
Closes #123
```

## 🚫 Prohibiciones Estrictas

### ❌ NUNCA hagas esto:
1. `firebase deploy` desde local
2. Push directo a `main`
3. Merge sin PR
4. Desarrollo sin emuladores
5. Commit sin probar localmente
6. Usar credenciales de producción en local
7. Commitear archivos `.env.local`
8. Modificar archivos de configuración sin discusión

### ❌ PRs que serán RECHAZADOS:
- Sin descripción clara
- Sin haber probado localmente
- Que rompan el build
- Con errores de linting
- Sin seguir el flujo de ramas
- Que modifiquen `.env.local` (debe estar en .gitignore)

## ✅ Buenas Prácticas

### 🔥 Firebase
- Siempre usar emuladores para desarrollo
- Verificar datos en Firebase Console local
- No usar credenciales de producción en local
- Probar autenticación en entorno controlado

### 🌿 Git
- Un commit por funcionalidad lógica
- Mensajes de commit descriptivos
- Rebase antes de PR si es necesario
- Mantener historial limpio

### 💻 Código
- Código limpio y comentado
- Consistencia en el estilo
- Manejar errores apropiadamente
- Optimizar imports

## 🔧 Setup para Nuevos Contribuidores

```bash
# 1. Fork y clone
git clone https://github.com/tu-usuario/cas.git
cd cas

# 2. Instalar dependencias
cd cas
npm install

# 3. Firebase CLI
npm install -g firebase-tools
firebase login

# 4. Variables de entorno
cp cas/.env.local.example cas/.env.local
# Editar con credenciales reales

# 5. Verificar setup
firebase emulators:start
# En otra terminal:
cd cas && npm run dev
```

## 📞 Ayuda y Soporte

### 🆘 Si tienes problemas:
1. Verificar que los emuladores estén corriendo
2. Comprobar variables de entorno
3. Revisar Firebase Console para errores
4. Consultar documentación en `.github/`

### 📧 Contacto:
- Issues: GitHub Issues
- Dudas técnicas: Crear issue con label `question`
- Bugs: Crear issue con label `bug`

---

**🎯 Objetivo**: Mantener un código estable, seguro y desplegable mediante buenas prácticas de desarrollo.
