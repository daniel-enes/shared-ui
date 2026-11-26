import { Component, signal } from '@angular/core';

import {
  UiButton,
  UiButtonLink
} from 'shared-ui';

@Component({
  selector: 'app-button-demo',
  imports: [
    UiButton,
    UiButtonLink
  ],
  templateUrl: './button-demo.html',
  styleUrl: './button-demo.scss'
})
export class ButtonDemo {

  readonly loading = signal(false);

  readonly clicks = signal(0);

  simulateAsyncAction(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    setTimeout(() => {
      this.loading.set(false);
      this.clicks.update((value) => value + 1);
    }, 1500);
  }

  registerClick(): void {
    this.clicks.update((value) => value + 1);
  }

}