import { TestBed } from '@angular/core/testing';

import { ValidationMessageService } from './validation-message.service';

import { UI_VALIDATION_MESSAGES } from '../tokens/validation-message.token';

describe('ValidationMessageService', () => {

  let service: ValidationMessageService;

  beforeEach(() => {

    TestBed.configureTestingModule({

      providers: [
        ValidationMessageService,

        {
          provide: UI_VALIDATION_MESSAGES,

          useValue: {
            defaults: {
              required: 'Preenchimento obrigatório.'
            }
          }
        }
      ]

    });

    service = TestBed.inject(ValidationMessageService);

  });

  it('should return the default required message', () => {

    const message = service.resolve({
      kind: 'required'
    });

    expect(message).toBe('Preenchimento obrigatório.');

  });

  it('should prioritize field-specific messages', () => {

    const message = service.resolve(
      { kind: 'required' },
      {
        field: 'username',

        config: {
          fields: {
            username: {
              required: 'Nome de usuário obrigatório.'
            }
          }
        }
      }
    );

    expect(message).toBe('Nome de usuário obrigatório.');

  });

  it('should return the fallback for unknown errors', () => {

    const message = service.resolve(
      { kind: 'someUnknownError' }
    );

    expect(message).toBe('O valor informado é inválido.');

  });

});