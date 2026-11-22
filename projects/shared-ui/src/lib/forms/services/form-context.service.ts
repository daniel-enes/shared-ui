import {
  computed,
  Injectable,
  Signal,
  signal
} from '@angular/core';

interface FormAlertReference {
  visible: Signal<boolean>;
  focus: () => void;
}

@Injectable()
export class FormContext {

  private readonly alertRequestedState = signal(false);

  readonly alertRequested = this.alertRequestedState.asReadonly();

  private readonly alert = signal<FormAlertReference | null>(null);

  private readonly focusRequests = signal(0);

  readonly hasAlert = computed(() => this.alert() !== null);

  readonly alertVisible = computed(
    () => this.alert()?.visible() ?? false
  );

  readonly canReturnToAlert = computed(
    () => this.hasAlert() && this.alertVisible()
  );

  readonly focusRequest = this.focusRequests.asReadonly();

  registerAlert(reference: FormAlertReference): () => void {
    this.alert.set(reference);

    return () => {
      if (this.alert() === reference) {
        this.alert.set(null);
      }
    };
  }

  focusAlert(): void {
    const alert = this.alert();

    if (alert?.visible()) {
      alert.focus();
    }
  }

  requestAlertFocus(): void {
    this.alertRequestedState.set(true);
    this.focusRequests.update(value => value + 1);
  }

  hideAlert(): void {
    this.alertRequestedState.set(false);
  }

}