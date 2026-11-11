import { test, expect } from '@playwright/test';

// Cada página carga, no da errores en consola y no se sale de ancho en el móvil.
const paginas = ['/', '/por-que-invertir', '/aprende', '/empieza', '/foro'];

for (const ruta of paginas) {
  test(`carga ${ruta}`, async ({ page }, info) => {
    const errores = [];
    page.on('pageerror', (e) => errores.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));

    await page.goto(ruta, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();

    const anchoExtra = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(anchoExtra, 'scroll horizontal').toBeLessThanOrEqual(1);

    await page.screenshot({
      path: `test-results/capturas/${info.project.name}${ruta === '/' ? '/inicio' : ruta}.png`,
      fullPage: true,
    });
    expect(errores, 'errores en consola').toEqual([]);
  });
}
