// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  sistema:'SIGESP SOLUCIONS',
  production: false,
  url: "http://localhost/php",   
  href: "http://localhost",
  fuentes_php:'/php',              
  carpeta: "", //siempre debe ir en ""
  apiUrl: "http://localhost:3000", //backend NestJS (sigesp_management)
  // SSO hacia los modulos SIGESP: desactivado hasta que existan los modulos destino.
  // TODO(SSO): activar cuando existan los modulos destino.
  //   1. Implementar en Nest: GET /auth/session y POST /auth/handoff/exchange.
  //   2. Cada modulo destino canjea el codigo y llama saveUser(payload).
  //   3. Poner ssoEnabled = true.
  //   NO reutilizar btoa(JSON.stringify(usuario)): exponia PII y no caducaba.
  ssoEnabled: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
