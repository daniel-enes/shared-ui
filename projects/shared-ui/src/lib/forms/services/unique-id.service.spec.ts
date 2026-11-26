import { TestBed } from '@angular/core/testing';
import { APP_ID } from '@angular/core';

import { UniqueIdService } from './unique-id.service';

describe('UniqueIdService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UniqueIdService,
        { provide: APP_ID, useValue: 'test-app' }
      ]
    });
  });

  it('should generate unique IDs', () => {
    const service = TestBed.inject(UniqueIdService);

    const firstId = service.generate('field');
    const secondId = service.generate('field');

    expect(firstId).not.toBe(secondId);
  });

  it('should include the application ID and prefix', () => {
    const service = TestBed.inject(UniqueIdService);

    const id = service.generate('field');

    expect(id).toBe('test-app-field-1');
  });

  it('should share the sequence between different prefixes', () => {
    const service = TestBed.inject(UniqueIdService);

    const fieldId = service.generate('field');
    const alertId = service.generate('alert');

    expect(fieldId).toBe('test-app-field-1');
    expect(alertId).toBe('test-app-alert-2');
  });

});