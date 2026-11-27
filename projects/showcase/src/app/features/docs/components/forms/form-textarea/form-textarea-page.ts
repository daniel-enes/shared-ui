import { Component } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-form-textarea-page',
  imports: [TranslocoPipe],
  standalone: true,
  styleUrl: './form-textarea-page.scss',
  templateUrl: './form-textarea-page.html',
})
export class FormTextareaPage {}
