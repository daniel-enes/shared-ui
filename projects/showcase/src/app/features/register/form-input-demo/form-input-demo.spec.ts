import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormInputDemo } from './form-input-demo';

describe('FormInputDemo', () => {
  let component: FormInputDemo;
  let fixture: ComponentFixture<FormInputDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
