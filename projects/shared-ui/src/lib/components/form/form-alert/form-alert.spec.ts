import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormAlert } from './form-alert';

describe('FormAlert', () => {
  let component: FormAlert;
  let fixture: ComponentFixture<FormAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAlert],
    }).compileComponents();

    fixture = TestBed.createComponent(FormAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
