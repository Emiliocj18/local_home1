import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  public readonly toasts = signal<Toast[]>([]);
  private counter = 0;

  public show(message: string, type: ToastType = 'info', duration = 3500): number {
    const id = ++this.counter;
    this.toasts.update((list) => [...list, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
    return id;
  }

  public success(message: string, duration = 3500): number {
    return this.show(message, 'success', duration);
  }

  public error(message: string, duration = 4000): number {
    return this.show(message, 'error', duration);
  }

  public dismiss(id: number): void {
    this.toasts.update((list) => list.filter((toast) => toast.id !== id));
  }
}
