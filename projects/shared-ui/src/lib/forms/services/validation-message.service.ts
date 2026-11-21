import { inject, Injectable } from '@angular/core';

import {
  ValidationError
} from '@angular/forms/signals';

import {
  ValidationMessageConfig,
  ValidationMessageValue
} from '../models/validation-message.model';

import {
  UI_VALIDATION_MESSAGES
} from '../tokens/validation-message.token';


const DEFAULT_VALIDATION_MESSAGES: Record<string, string> = {

  required: 'Este campo é obrigatório.',

  email: 'Informe um endereço de email válido.',

  minLength: 'O valor informado é muito curto.',

  maxLength: 'O valor informado é muito longo.',

  min: 'O valor informado é inferior ao permitido.',

  max: 'O valor informado é superior ao permitido.',

  pattern: 'O formato informado é inválido.',

  unknown: 'O valor informado é inválido.'

};


@Injectable({
  providedIn: 'root'
})
export class ValidationMessageService {

  private readonly globalConfig =
    inject(UI_VALIDATION_MESSAGES, { optional: true });

  /**
   * Resolves the message associated with a validation error.
   */
  resolve(
    error: ValidationError,
    options: {
      field?: string;
      scope?: 'field' | 'form';
      config?: ValidationMessageConfig;
    } = {}
  ): string {

    const { field, scope = 'field', config = {} } = options;

    const localMessages = scope === 'form'
      ? config.form
      : field
        ? config.fields?.[field]
        : undefined;

    const globalMessages = scope === 'form'
      ? this.globalConfig?.form
      : field
        ? this.globalConfig?.fields?.[field]
        : undefined;

    const candidates: Array<ValidationMessageValue | undefined> = [

      localMessages?.[error.kind],

      globalMessages?.[error.kind],

      config.defaults?.[error.kind],

      this.globalConfig?.defaults?.[error.kind],

      DEFAULT_VALIDATION_MESSAGES[error.kind],

      config.fallback,

      this.globalConfig?.fallback,

      DEFAULT_VALIDATION_MESSAGES['unknown']

    ];

    const message = candidates.find(
      candidate => candidate !== undefined
    )!;

    return typeof message === 'function'
      ? message(error)
      : message;
  }
}