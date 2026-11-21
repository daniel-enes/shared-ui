import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormInputDemo } from './features/register/form-input-demo/form-input-demo';
import { MultipleFormsDemo } from './features/register/multiple-forms-demo/multiple-forms-demo';

@Component({
  imports: [RouterOutlet, MultipleFormsDemo, FormInputDemo],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('showcase');
}
