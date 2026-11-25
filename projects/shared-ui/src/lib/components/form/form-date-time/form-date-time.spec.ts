import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormDateTime } from './form-date-time';

describe('FormDateTime', () => {
  let component: FormDateTime;
  let fixture: ComponentFixture<FormDateTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDateTime],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDateTime);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
