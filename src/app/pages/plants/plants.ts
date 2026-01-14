import { Component } from '@angular/core';
import { hlmH2, hlmH3 } from '@spartan-ng/helm/typography';
import { PlantList } from './plant-list/plant-list';
import { PlantAdd } from './plant-add/plant-add';

@Component({
  selector: 'app-plants',
  imports: [PlantList, PlantAdd],
  templateUrl: './plants.html',
})
export class Plants {
  protected readonly hlmH2 = hlmH2;
  protected readonly hlmH3 = hlmH3;
}
