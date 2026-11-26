import { Injectable } from '@angular/core';
import { ModuleOpenResult, ModuleTab, ModuleTabRoute } from '@core/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ModuleManagerService {

  private tabs: ModuleTab[] = [];

  // Única puerta de apertura de módulos. No registra nada si el popup se bloquea.
  public addTab(tab: ModuleTabRoute): ModuleOpenResult {
    const href = (tab.href ?? tab.url).replace(/\/$/, '');
    const existing = this.tabs.find((open) => open.name === tab.name);

    if (existing && !existing.win.closed) {
      existing.win.focus();
      return 'focused';
    }

    // Una pestaña cerrada deja de ser válida: se reemplaza su registro.
    if (existing) {
      this.tabs = this.tabs.filter((open) => open.name !== tab.name);
    }

    const win = window.open(tab.url, '_blank');
    if (!win) {
      return 'blocked';
    }

    // Se anula el opener sin perder la referencia que usa closeAll().
    win.opener = null;
    this.tabs.push({ name: tab.name, win, href });
    return 'opened';
  }

  // Cierre local de cada módulo registrado. Tolera pestañas cerradas o sin href.
  public closeAll(): void {
    this.tabs.forEach((tab) => {
      if (!tab.href) return;
      if (!tab.win || tab.win.closed) return;

      tab.win.location.href = `${tab.href}/auth/close`;
    });

    this.tabs = [];
  }

}
