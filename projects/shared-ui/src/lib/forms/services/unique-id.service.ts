import {
  APP_ID,
  inject,
  Injectable
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UniqueIdService {

  private readonly appId = inject(APP_ID);

  private nextId = 0;

  generate(prefix: string): string {
    this.nextId++;

    return `${this.appId}-${prefix}-${this.nextId}`;
  }

}