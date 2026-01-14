import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { PlantService } from '../../../services/plant.service';
import {
  HlmItem,
  HlmItemContent,
  HlmItemGroup,
  HlmItemHeader,
  HlmItemTitle,
} from '@spartan-ng/helm/item';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { hlmH4 } from '@spartan-ng/helm/typography';
import { PlantWithImage } from '../../../../../libs/drizzle';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { HlmAlert, HlmAlertIcon, HlmAlertTitle } from '@spartan-ng/helm/alert';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-plant-list',
  imports: [
    HlmItemGroup,
    HlmItem,
    HlmItemContent,
    HlmItemTitle,
    HlmSkeleton,
    HlmAlertIcon,
    HlmAlert,
    NgIcon,
    HlmAlertTitle,
    HlmIconImports,
    HlmItemHeader,
  ],
  templateUrl: './plant-list.html',
  providers: [provideIcons({ lucideInfo })],
})
export class PlantList implements OnInit {
  private plantService = inject(PlantService);

  protected readonly hlmH4 = hlmH4;

  readonly isLoading = this.plantService.isLoading;
  readonly plants: Signal<PlantWithImage[]> = this.plantService.plants;

  ngOnInit(): void {
    this.plantService.getPlants();
  }
}
