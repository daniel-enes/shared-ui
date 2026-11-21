import { InjectionToken } from '@angular/core';

import {
  ValidationMessageConfig
} from '../models/validation-message.model';

/**
 * Allows applications to override the default
 * validation messages provided by the library.
 */
export const UI_VALIDATION_MESSAGES =
  new InjectionToken<ValidationMessageConfig>(
    'UI_VALIDATION_MESSAGES'
  );