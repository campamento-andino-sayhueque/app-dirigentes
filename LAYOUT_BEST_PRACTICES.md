# 📐 Mejores Prácticas para Layouts Mobile/Desktop

## ❌ Problema: Spacers Huérfanos

**ANTES (MAL):**
```tsx
// ❌ Crear divs vacíos solo para spacing
<MobileFooter />
<div className="hidden md:block h-16"></div>  {/* Spacer huérfano */}
<div className="md:hidden h-20"></div>        {/* Spacer huérfano */}
{children}
```

**Problemas:**
- Divs sin propósito semántico
- Difícil de mantener
- Pueden aparecer con fondos incorrectos
- No responsive de forma natural

---

## ✅ Solución 1: CSS Grid Layout (RECOMENDADO)

### En `layout.tsx`:
```tsx
<html lang="es" className="h-full">
  <body className="h-full">
    <div className="h-full grid grid-rows-[auto_1fr_auto] md:grid-rows-[auto_1fr]">
      {/* Header/Nav - altura automática */}
      <Navigation />
      
      {/* Contenido - toma el espacio restante (1fr) */}
      <main className="overflow-auto">
        {children}
      </main>
      
      {/* Footer mobile está fixed, no en el grid */}
    </div>
  </body>
</html>
```

**Explicación del Grid:**
- `grid-rows-[auto_1fr_auto]`: 3 filas en mobile
  - `auto`: Header (altura según contenido)
  - `1fr`: Main (toma TODO el espacio restante)
  - `auto`: Footer (si no es fixed)
  
- `md:grid-rows-[auto_1fr]`: 2 filas en desktop
  - `auto`: Header
  - `1fr`: Main (footer mobile está hidden)

### En componentes de página:
```tsx
// ✅ Usar h-full en lugar de min-h-screen
<div className="h-full bg-gradient-to-br from-green-50 to-red-50 pb-20 md:pb-0">
  <div className="container mx-auto px-4 py-8">
    {/* Contenido */}
  </div>
</div>
```

---

## ✅ Solución 2: Flexbox Layout (Alternativa)

```tsx
<body className="h-full flex flex-col">
  <Navigation />
  
  <main className="flex-1 overflow-auto">
    {children}
  </main>
  
  {/* Footer si es necesario */}
</body>
```

**Ventajas de Flexbox:**
- Más simple para layouts lineales
- `flex-1` = "toma todo el espacio disponible"
- Fácil de entender

---

## 🎯 Manejo de Navegación Fixed vs Static

### Navbar Desktop (parte del flujo):
```tsx
// ✅ NO usar fixed, sino parte del grid
<nav className="hidden md:block bg-white border-b">
  {/* Contenido del nav */}
</nav>
```

### Footer Mobile (fixed):
```tsx
// ✅ Puede ser fixed porque está fuera del flujo
<nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
  {/* Contenido del footer */}
</nav>
```

**Regla General:**
- **Desktop navbar**: Static (parte del layout grid)
- **Mobile footer**: Fixed (flota sobre el contenido)
- **Contenido de páginas**: Debe tener `pb-20` en mobile para el footer fixed

---

## 📱 Responsive Padding

```tsx
// ✅ Padding responsive correcto
className="
  pb-20       // Mobile: espacio para footer fixed
  md:pb-8     // Desktop: padding normal
  md:px-6     // Desktop: padding lateral
"
```

---

## 🔧 Checklist de Implementación

- [ ] `html` y `body` tienen `h-full` o `height: 100%`
- [ ] Layout usa Grid o Flexbox (NO spacers huérfanos)
- [ ] Main tiene `1fr` (Grid) o `flex-1` (Flexbox)
- [ ] Main tiene `overflow-auto` para scroll interno
- [ ] Páginas usan `h-full` en lugar de `min-h-screen`
- [ ] Navbar desktop NO es fixed (parte del grid)
- [ ] Footer mobile SÍ es fixed (con z-50)
- [ ] Contenido tiene padding-bottom para footer mobile

---

## 🎨 Ejemplo Completo

### `app/layout.tsx`:
```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full">
        <AuthProvider>
          <div className="h-full grid grid-rows-[auto_1fr] md:grid-rows-[auto_1fr]">
            <Navigation />
            <main className="overflow-auto">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### `components/Navigation.tsx`:
```tsx
export default function Navigation() {
  return (
    <>
      {/* Desktop - parte del grid */}
      <nav className="hidden md:block bg-white border-b h-16">
        {/* Nav items */}
      </nav>

      {/* Mobile - fixed, fuera del flujo */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white">
        {/* Nav items */}
      </nav>
    </>
  );
}
```

### `app/dashboard/page.tsx`:
```tsx
export default function DashboardPage() {
  return (
    <div className="h-full bg-gradient-to-br from-green-50 to-red-50 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Contenido */}
      </div>
    </div>
  );
}
```

---

## 🚀 Beneficios de Esta Arquitectura

1. **Semántico**: Cada elemento tiene un propósito claro
2. **Mantenible**: No hay divs mágicos
3. **Responsive**: El layout se adapta naturalmente
4. **Sin bugs visuales**: No hay espacios inesperados
5. **Performance**: El navegador optimiza Grid/Flexbox
6. **Accesible**: Estructura HTML lógica

---

## 📚 Recursos

- [CSS Grid Layout - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Flexbox - CSS Tricks](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid-template-rows)
- [Tailwind CSS Flexbox](https://tailwindcss.com/docs/flex)

---

**Autor**: Sistema de Gestión CAS  
**Fecha**: Octubre 2025  
**Versión**: 1.0
