import { ValidationError } from '@angular/forms/signals';

/**
 * A message can be static or dynamically generated
 * based on the validation error.
 */
export type ValidationMessageValue =
  | string
  | ((error: ValidationError) => string);

/**
 * Collection of messages indexed by validation error code.
 */
export type ValidationMessageMap = Readonly<
  Record<string, ValidationMessageValue>
>;

/**
 * Configuration for validation messages.
 *
 * Fields:
 *   Messages specific to individual fields.
 *
 * Form:
 *   Messages associated with form-level validation.
 *
 * Defaults:
 *   Messages that apply when no field-specific message exists.
 *
 * Fallback:
 *   Message used when no matching error message is found.
 */
export interface ValidationMessageConfig {

  fields?: Readonly<
    Record<string, ValidationMessageMap>
  >;

  form?: ValidationMessageMap;

  defaults?: ValidationMessageMap;

  fallback?: ValidationMessageValue;
}