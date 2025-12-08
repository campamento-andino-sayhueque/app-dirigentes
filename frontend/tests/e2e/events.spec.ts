import { test, expect } from '@playwright/test';

test.describe('Calendario Events', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Bypass Auth using the new AuthContext logic
    await page.addInitScript(() => {
      localStorage.setItem('E2E_TEST_USER', 'true');
    });

    // 2. Mock API Responses to avoid 403s and backend dependency
    // Mock Tipos
    await page.route('**/api/calendario/tipos', async route => {
      console.log('Mock hit: tipos');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          _embedded: {
            tipoEventoModelList: [
              { codigo: 'actividad', etiqueta: 'Actividad', _links: {} },
              { codigo: 'reunion', etiqueta: 'Reunión', _links: {} }
            ]
          }
        }
      });
    });

    // Mock GET Eventos (Initial load)
    await page.route('**/api/calendario/eventos*', async route => {
      console.log('Mock hit: eventos ' + route.request().method());
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          json: {
            _embedded: {
              eventoCalendarioModelList: []
            }
          }
        });
      } else if (route.request().method() === 'POST') {
        const data = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          json: {
            id: 12345,
            ...data
          }
        });
      } else {
        await route.continue();
      }
    });

    // Navigate to calendar page
    await page.goto('/calendario');
  });

  test('should create a new event', async ({ page }) => {
    // 1. Open "Create Event" modal
    await page.getByRole('button', { name: /nuevo evento/i }).click();
    
    // 2. Fill form
    await page.getByLabel(/título/i).fill('Campamento de Prueba E2E');
    await page.getByLabel(/descripción/i).fill('Evento creado automáticamente por Playwright');
    
    // Select type
    // Short delay for UI stability (Radix Select Portal)
    await page.waitForTimeout(1000);

    const trigger = page.getByRole('combobox');
    await trigger.waitFor({ state: 'visible' });
    await trigger.click({ force: true });
    
    // Shadcn Select content
    // Use getByText as it's often more reliable for SelectItem content in Portals
    const option = page.getByText('Actividad', { exact: true });
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click({ force: true });

    // Dates
    const start = new Date();
    start.setMinutes(start.getMinutes() + 10); // Future
    const startStr = start.toISOString().slice(0, 16);
    
    const end = new Date(start);
    end.setHours(end.getHours() + 2);
    const endStr = end.toISOString().slice(0, 16);

    await page.getByLabel(/fecha inicio/i).fill(startStr);
    await page.getByLabel(/fecha fin/i).fill(endStr);
    
    await page.getByLabel(/ubicación/i).fill('Lugar de Prueba');

    // 3. Submit
    // We mocked the POST request above, so this should suffice.
    await page.getByRole('button', { name: /crear evento/i }).click();

    // 4. Verify
    // Check if modal closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Manual reload or check if re-fetch happens. 
    // Since we mocked GET to return [], the new event won't appear unless we update the mock statefully.
    // But success toast or modal close is a good first step.
    // Let's settle for modal closing for this iteration.
  });
});
