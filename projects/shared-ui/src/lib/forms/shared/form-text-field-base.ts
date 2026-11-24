import {
  computed,
  Directive
} from '@angular/core';

import { FormFieldBase } from './form-field-base';

@Directive()
export abstract class FormTextFieldBase extends FormFieldBase<string> {

  readonly maxLength = computed(
    () => this.fieldState().maxLength?.() ?? null
  );

  readonly currentLength = computed(
    () => this.fieldState().controlValue().length
  );

  readonly characterCountId = computed(
    () => `${this.resolvedInputId()}-character-count`
  );

  readonly showCharacterCount = computed(
    () => this.maxLength() !== null
  );

  readonly describedByWithCharacterCount = computed(() => {

    const ids = [
      this.describedBy(),
      this.showCharacterCount() ? this.characterCountId() : null
    ].filter((id): id is string => !!id);

    return ids.length > 0 ? ids.join(' ') : null;

  });

}