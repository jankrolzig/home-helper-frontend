import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucideFileScan } from '@ng-icons/lucide';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmInput } from '@spartan-ng/helm/input';
import { PlantService } from '../../../services/plant.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-plant-add',
  imports: [HlmButton, NgIcon, HlmIcon, HlmLabel, HlmInput],
  templateUrl: './plant-add.html',
  providers: [provideIcons({ lucideFileScan })],
})
export class PlantAdd {
  private plantService = inject(PlantService);

  selectedImages: File[] = [];
  isLoading = false;

  onImageSelected(event: any): void {
    this.selectedImages = Array.from(event.target.files);
  }

  async identifyPlant(): Promise<void> {
    if (this.selectedImages.length === 0) {
      alert('Please select at least one image');
      return;
    }

    this.isLoading = true;

    try {
      const request = { images: this.selectedImages };

      const createdPlant = await this.plantService.identifyPlant(request);
      if (createdPlant) {
        this.selectedImages = [];
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
