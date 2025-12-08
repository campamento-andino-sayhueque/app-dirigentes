import { test, expect } from '@playwright/test';

test('pagina de inicio carga correctamente', async ({ page }) => {
  await page.goto('/');

  // Verificar que el título de la página sea correcto
  await expect(page.getByRole('heading', { name: 'Campamento Andino' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sayhueque' })).toBeVisible(); 
});
