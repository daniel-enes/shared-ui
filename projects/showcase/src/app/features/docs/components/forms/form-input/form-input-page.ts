import { Component } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-form-input-page',
  imports: [TranslocoPipe],
  standalone: true,
  styleUrl: './form-input-page.scss',
  templateUrl: './form-input-page.html',
})
export class FormInputPage {}
