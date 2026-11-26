import { Component, signal } from '@angular/core';

import { UiAlert } from 'shared-ui';

@Component({
  selector: 'app-alert-demo',
  imports: [UiAlert],
  templateUrl: './alert-demo.html'
})
export class AlertDemo {

  visible = signal(false);

  dismissible = signal(true);

  variant = signal<'success' | 'info' | 'warning' | 'danger'>('success');

  title = signal('Operação realizada');

  message = signal('As alterações foram salvas com sucesso.');

  dismissedCount = signal(0);

  // Drafts para edição sem aplicar imediatamente ao alerta
  draftTitle = signal('Operação realizada');

  draftMessage = signal('As alterações foram salvas com sucesso.');

  show(): void {
    this.visible.set(true);
  }

  hide(): void {
    this.visible.set(false);
  }

  toggleDismissible(): void {
    this.dismissible.update((value) => !value);
  }

  setVariant(value: 'success' | 'info' | 'warning' | 'danger'): void {
    this.variant.set(value);
  }

  setDraftTitle(value: string): void {
    this.draftTitle.set(value);
  }

  setDraftMessage(value: string): void {
    this.draftMessage.set(value);
  }

  applyChanges(): void {
    this.title.set(this.draftTitle());
    this.message.set(this.draftMessage());
  }

  onDismissed(): void {
    this.dismissedCount.update((count) => count + 1);
    this.hide();
  }

  simulateNewOperation(): void {
    this.title.set('Registro atualizado');
    this.message.set('Os dados foram salvos com sucesso.');
    this.draftTitle.set(this.title());
    this.draftMessage.set(this.message());
    this.variant.set('success');
    this.visible.set(true);
  }

}
