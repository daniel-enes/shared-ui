import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormInputDemo } from './features/register/form-input-demo/form-input-demo';
import { MultipleFormsDemo } from './features/register/multiple-forms-demo/multiple-forms-demo';
import { RegisterFormDemo } from './features/register/register-form-demo/register-form-demo';

@Component({
  imports: [RouterOutlet, MultipleFormsDemo, FormInputDemo, RegisterFormDemo],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('showcase');
}
