import { Component } from '@angular/core';
import { hlmH2, hlmH3 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-plants',
  imports: [],
  templateUrl: './plants.html',
})
export class Plants {
  protected readonly hlmH2 = hlmH2;
  protected readonly hlmH3 = hlmH3;
}
