import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { PlantService } from '../../../services/plant.service';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { hlmH4 } from '@spartan-ng/helm/typography';
import { PlantWithImage } from '../../../../../libs/drizzle';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideInfo } from '@ng-icons/lucide';
import { HlmAlert, HlmAlertIcon, HlmAlertTitle } from '@spartan-ng/helm/alert';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import {
  HlmCard,
  HlmCardAction,
  HlmCardContent,
  HlmCardHeader,
  HlmCardTitle,
} from '@spartan-ng/helm/card';
import { HlmButton } from '@spartan-ng/helm/button';
import { NgOptimizedImage } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-plant-list',
  imports: [
    HlmSkeleton,
    HlmAlertIcon,
    HlmAlert,
    NgIcon,
    HlmAlertTitle,
    HlmIconImports,
    HlmCard,
    HlmCardHeader,
    HlmCardAction,
    HlmCardContent,
    HlmButton,
    HlmCardTitle,
    NgOptimizedImage,
  ],
  templateUrl: './plant-list.html',
  providers: [provideIcons({ lucideInfo, lucideHeart })],
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
