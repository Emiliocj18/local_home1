import { Injectable } from '@angular/core';
import { ModuleTab, ModuleTabRoute } from '@core/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ModuleManagerService {

  private tabs: ModuleTab[] = [];

  constructor() { }

  public addTab(newTab: ModuleTabRoute){

    const index = this.tabs.findIndex(e => {
      return (e.name == newTab.name)
    })

    if (index >= 0) {
      if (this.tabs[index].win.closed) {
        this.tabs.splice(index, 1)
        this.pushTab(newTab)
      } else {
        this.tabs[index].win.focus();
      }
    } else {
      this.pushTab(newTab)
    }
  }

  private pushTab(newTab: ModuleTabRoute){
    const tab = window.open(newTab.url, '_blank')
    tab.focus()
    this.tabs.push({
      name: newTab.name,
      win: tab,
      href: newTab.href
    })
  }

  // TODO-MIGRACION: solo cierra pestañas; ya no limpia storage (la sesion vive en memoria).
  public closeAll(){

    this.tabs.forEach(e => {
      if (!e.win.closed) {
        e.win.location.href = e.href + '/auth/close';
      } else {
        e.win = window.open(e.href + '/auth/close', '_blank')
      }
    });

    this.tabs = [];
  }

}
