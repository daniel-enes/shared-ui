import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultipleFormsDemo } from './multiple-forms-demo';

describe('MultipleFormsDemo', () => {
  let component: MultipleFormsDemo;
  let fixture: ComponentFixture<MultipleFormsDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleFormsDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleFormsDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
