
/*
Las variables ip, carpeta_base y fuentes_php No pueden cambiar de nombre.
*/

const sistema='SIGESP';      //nombre sistema
const ip='http://144.126.156.32/';      //puede ser localhost, otra IP,  etc.
//let ip='https://sigespsolucions.servehttp.com/';
const carpeta_base='SigespERPv3';     //nombre carpeta base.    dicha carpeta puede variar a sigesp_estable, SigespERP o en otro caso que se necesite.
const fuentes_php='/php';      //nombre oficial de nuestra carpeta de fuentes php.  no cambiara de nombre.


export const environment = {
  production: true,
  url: ip+carpeta_base+fuentes_php,
  href: ip+carpeta_base,
  carpeta: carpeta_base,
  sistema:sistema,
  fuentes_php:fuentes_php,
  // TODO-MIGRACION: cambiar por la URL del backend NestJS desplegado (HTTPS).
  apiUrl: "http://localhost:3000",
  // SSO hacia los modulos SIGESP: desactivado hasta que existan los modulos destino.
  // TODO(SSO): activar cuando existan los modulos destino.
  //   1. Implementar en Nest: GET /auth/session y POST /auth/handoff/exchange.
  //   2. Cada modulo destino canjea el codigo y llama saveUser(payload).
  //   3. Poner ssoEnabled = true.
  //   NO reutilizar btoa(JSON.stringify(usuario)): exponia PII y no caducaba.
  ssoEnabled: false
};
