import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { NewPlant, Plant, PlantImage, PlantWithImage } from '../../../libs/drizzle';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private supabase = inject(SupabaseService).getClient();

  private readonly _plants: WritableSignal<PlantWithImage[]> = signal([]);
  private readonly _isLoading = signal(false);

  async getPlants(): Promise<void> {
    this._isLoading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('plants')
        .select(
          `
            *,
            plant_images (
              id,
              path,
              created_at
            )
          `,
        )
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const plantsWithUrls: PlantWithImage[] = await Promise.all(
        data.map(async (plant: Plant & { plant_images: PlantImage[] }) => {
          const imagesWithUrls = await Promise.all(
            plant.plant_images.map(async (img: PlantImage) => {
              const { data: signedUrlData, error } = await this.supabase.storage
                .from('plant-images')
                .createSignedUrl(img.path, 60); // URL valid for 60 seconds

              if (error || !signedUrlData) {
                throw new Error(error?.message || 'Failed to get URL');
              }

              return {
                id: img.id,
                url: signedUrlData.signedUrl,
              };
            }),
          );

          return {
            ...plant,
            plant_images: imagesWithUrls,
          };
        }),
      );

      this._plants.set(plantsWithUrls);
    } catch (error) {
      toast('Failed to load plants', {
        position: 'bottom-right',
        duration: 3000,
      });
      console.error('Error fetching plants:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  async getPlantById(id: string): Promise<Plant | null> {
    this._isLoading.set(true);
    try {
      const { data, error } = await this.supabase.from('plants').select('*').eq('id', id).single();

      if (error) {
        throw error;
      }
      return data as Plant;
    } catch (error) {
      this._isLoading.set(false);
      return null;
    }
  }

  async createPlant(plant: NewPlant): Promise<Plant | null> {
    this._isLoading.set(true);
    try {
      const { data, error } = await this.supabase.from('plants').insert([plant]).select().single();

      if (error) {
        throw error;
      }

      toast('Plant added successfully', {
        description: `${plant.name} now available in your collection!`,
        duration: 3000,
      });
      return data as Plant;
    } catch (error) {
      toast('Failed to add plant', {
        description: 'Please try again later.',
        duration: 3000,
      });
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }

  async updatePlant(id: string, updates: Partial<Plant>): Promise<Plant | null> {
    this._isLoading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('plants')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast('Plant updated successfully', {
        description: `${updates.name} updated successfully!`,
        duration: 3000,
      });
      return data as Plant;
    } catch (error) {
      toast('Failed to update plant', {
        description: 'Please try again later.',
        duration: 3000,
      });
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }

  async deletePlant(id: string, name: string): Promise<boolean> {
    this._isLoading.set(true);
    try {
      const { error } = await this.supabase.from('plants').delete().eq('id', id);

      if (error) {
        throw error;
      }

      toast('Plant deleted successfully', {
        description: `${name} removed from your collection.`,
        duration: 3000,
      });
      return true;
    } catch (error) {
      toast('Failed to delete plant', {
        description: 'Please try again later.',
        duration: 3000,
      });
      console.error('Error deleting plant:', error);
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  async identifyPlant(request: { images: File[] }): Promise<Plant> {
    try {
      if (!request.images || request.images.length === 0) {
        throw new Error('At least one image is required');
      }

      const imagePromises = request.images.map((file) => this.fileToBase64(file));
      const base64Images = await Promise.all(imagePromises);
      const requestBody = { images: base64Images };
      const { data, error } = await this.supabase.functions.invoke('plant-identify', {
        body: requestBody,
      });

      if (error) {
        throw new Error(`Edge Function error: ${error.message}`);
      }

      return data as Plant;
    } catch (error: any) {
      console.error('Plant identification failed:', error);
      return {} as Plant;
    }
  }

  get plants(): Signal<PlantWithImage[]> {
    return this._plants.asReadonly();
  }

  get isLoading(): Signal<boolean> {
    return this._isLoading.asReadonly();
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (): void => resolve(reader.result as string);
      reader.onerror = (error): void => reject(error);
    });
  }
}
