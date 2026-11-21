import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterFormDemo } from './register-form-demo';

describe('RegisterFormDemo', () => {
  let component: RegisterFormDemo;
  let fixture: ComponentFixture<RegisterFormDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
