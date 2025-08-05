## 📋 Descripción
Breve descripción de los cambios realizados.

## 🔄 Tipo de Cambio
- [ ] 🆕 Nueva funcionalidad (feature)
- [ ] 🐛 Corrección de bug (bugfix)
- [ ] 🚨 Corrección crítica (hotfix)
- [ ] ♻️ Refactorización (refactor)
- [ ] 📚 Documentación (docs)
- [ ] 🎨 Cambios de estilo/UI (style)

## ✅ Checklist Pre-PR

### 🔥 Firebase Local Testing
- [ ] Emuladores de Firebase iniciados (`firebase emulators:start`)
- [ ] Funcionalidad probada en Firebase Console local (http://localhost:4000)
- [ ] Auth probado en emulador (si aplica)
- [ ] Firestore probado en emulador (si aplica)

### 💻 Desarrollo Local
- [ ] Build exitoso (`npm run build`)
- [ ] Sin errores de linting (`npm run lint`)
- [ ] Aplicación funciona en desarrollo (`npm run dev`)
- [ ] No hay errores en consola del navegador

### 📝 Código
- [ ] Código limpio y comentado
- [ ] Manejo de errores implementado
- [ ] Variables de entorno correctas
- [ ] No se incluye `.env.local` en commit

### 🌿 Git
- [ ] Rama creada desde `dev`
- [ ] Commits con mensajes descriptivos
- [ ] No hay commits innecesarios

## 🧪 Pruebas Realizadas

### En Firebase Console Local:
- [ ] Prueba 1: [describe qué probaste]
- [ ] Prueba 2: [describe qué probaste]
- [ ] Prueba 3: [describe qué probaste]

### En la Aplicación:
- [ ] Funcionalidad principal
- [ ] Casos edge/límite
- [ ] Responsive design (si aplica)
- [ ] Accesibilidad básica

## 📱 Dispositivos/Navegadores Probados
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop (macOS)
- [ ] Chrome Mobile
- [ ] Safari Mobile (iOS)

## 🔗 Issues Relacionados
- Closes #[número]
- Fixes #[número]
- Related to #[número]

## 📸 Screenshots/Videos (si aplica)

### Antes:
[Imagen del estado anterior]

### Después:
[Imagen del nuevo estado]

## 🚀 Notas de Despliegue
- [ ] No requiere variables de entorno nuevas
- [ ] No requiere migraciones de base de datos
- [ ] No requiere cambios en reglas de Firestore
- [ ] Compatible con la versión actual de producción

## ⚠️ Breaking Changes
- [ ] No hay breaking changes
- [ ] Hay breaking changes (describe abajo)

[Si hay breaking changes, explica qué se rompe y cómo migrar]

## 🔍 Revisión Específica
¿Hay algo específico en lo que te gustaría que el reviewer se enfoque?

## 📋 Notas Adicionales
Cualquier información adicional que sea relevante para el reviewer.

---

### 🎯 Para el Reviewer:

#### ✅ Checklist de Revisión:
- [ ] El código sigue las convenciones del proyecto
- [ ] La funcionalidad está bien documentada
- [ ] No hay vulnerabilidades de seguridad obvias
- [ ] El PR tiene un título y descripción claros
- [ ] Los cambios son apropiados para el alcance del PR
- [ ] La funcionalidad ha sido probada adecuadamente
