import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormNumber } from './form-number';

describe('FormNumber', () => {
  let component: FormNumber;
  let fixture: ComponentFixture<FormNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormNumber],
    }).compileComponents();

    fixture = TestBed.createComponent(FormNumber);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
