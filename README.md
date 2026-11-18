# SIGESPv3 — local_home

Módulo "home" del ERP SIGESP. Aplicación Angular 22 con arquitectura NgModule.

## Requisitos

- Node `^22.22.3 || ^24.15.0 || >=26` (hay `.nvmrc` con `24`)
- Acceso al registry privado de GitHub Packages para `@emiliocj18/*`

`.npmrc` del proyecto:

```
@emiliocj18:registry=https://npm.pkg.github.com
```

## Comandos

```powershell
npm ci                        # instalación reproducible
npm start                     # servidor de desarrollo (http://localhost:4200)
npm run build                 # build de producción
npm run local                 # build con base-href /local_home/
npx ng test --watch=false     # tests unitarios (Vitest)
npm run lint                  # ESLint (flat config)
```

## Stack

| Elemento | Versión |
|---|---|
| Angular / CLI | 22.2.x |
| TypeScript | 6.0.x |
| Angular Material | 22.3.x |
| `@emiliocj18/sigesp-core` | 5.0.0 |
| Builder | `@angular/build:application` |
| Tests | Vitest 5 |
| Lint | ESLint 10 + Angular ESLint 22 |

## Notas de migración (Angular 20 → 22)

- El bootstrap usa `platformBrowser()`; ya no hay JIT ni
  `@angular/platform-browser-dynamic`.
- Un solo tema de Material: `indigo-pink.css`. Se eliminó el bloque SCSS con
  `m2-define-palette` / `m2-define-light-theme`, que ya no existe en Material 22.
- `ngx-toastr` fue reemplazado por `MatSnackBar`. Los estilos de las
  notificaciones están en `src/styles.scss` (`sigesp-snackbar-*`).
- Se eliminaron dependencias sin uso: `@ng-bootstrap/ng-bootstrap`,
  `highcharts`, `highcharts-angular`, `angular-util`, `force`,
  `moment-duration-format`, `@angular/localize`, `crypto-js`, `hammerjs`.
- Se eliminó Protractor, TSLint y `src/polyfills.ts` (el builder carga
  `zone.js` directamente).
- `@angular/animations` ya no es dependencia; Material 22 no la necesita.
- Budget inicial: 2 MB de aviso / 3 MB de error. El build real queda en ~1.79 MB.

## Tests

Los tests están en `src/**/*.spec.ts` y corren con Vitest a través de
`@angular/build:unit-test`. El setup de zone.js vive en `src/test-setup.ts`.

## Pendientes

- Activar `strict` y `strictTemplates` en una fase posterior.
- Cubrir login, menú y perfil con pruebas de integración o Playwright.
