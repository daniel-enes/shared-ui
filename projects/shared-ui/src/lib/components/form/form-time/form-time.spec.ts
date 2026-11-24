import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormTime } from './form-time';

describe('FormTime', () => {
  let component: FormTime;
  let fixture: ComponentFixture<FormTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTime],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTime);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
