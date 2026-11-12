
/*
Las variables ip, carpeta_base y fuentes_php No pueden cambiar de nombre.
*/

let sistema='SIGESP';      //nombre sistema
let ip='http://144.126.156.32/';      //puede ser localhost, otra IP,  etc.
//let ip='https://sigespsolucions.servehttp.com/';
let carpeta_base='SigespERPv3';     //nombre carpeta base.    dicha carpeta puede variar a sigesp_estable, SigespERP o en otro caso que se necesite.
let fuentes_php='/php';      //nombre oficial de nuestra carpeta de fuentes php.  no cambiara de nombre.


export const environment = {
  production: true,
  url: ip+carpeta_base+fuentes_php,
  href: ip+carpeta_base,
  carpeta: carpeta_base,
  sistema:sistema,
  fuentes_php:fuentes_php
};
