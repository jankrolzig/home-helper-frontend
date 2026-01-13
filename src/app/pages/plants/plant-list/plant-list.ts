import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-plant-list',
  imports: [],
  templateUrl: './plant-list.html',
})
export class PlantList {}
