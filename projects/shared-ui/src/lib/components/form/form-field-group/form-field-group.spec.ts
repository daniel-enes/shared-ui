import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldGroup } from './form-field-group';

describe('FormFieldGroup', () => {
  let component: FormFieldGroup;
  let fixture: ComponentFixture<FormFieldGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
