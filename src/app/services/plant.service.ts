import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { NewPlant, Plant } from '../../../libs/drizzle/schema/plants';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class PlantsService {
  private supabase = inject(SupabaseService).getClient();
  readonly isLoading = signal(false);

  async getPlants(): Promise<Plant[]> {
    this.isLoading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('plants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return data as Plant[];
    } catch (error) {
      toast('Failed to load plants', {
        position: 'bottom-right',
        duration: 3000,
      });
      console.error('Error fetching plants:', error);
      return [];
    } finally {
      this.isLoading.set(false);
    }
  }

  async getPlantById(id: string): Promise<Plant | null> {
    this.isLoading.set(true);
    try {
      const { data, error } = await this.supabase.from('plants').select('*').eq('id', id).single();

      if (error) {
        throw error;
      }
      return data as Plant;
    } catch (error) {
      this.isLoading.set(false);
      return null;
    }
  }

  async createPlant(plant: NewPlant): Promise<Plant | null> {
    this.isLoading.set(true);
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
      this.isLoading.set(false);
    }
  }

  async updatePlant(id: string, updates: Partial<Plant>): Promise<Plant | null> {
    this.isLoading.set(true);
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
      this.isLoading.set(false);
    }
  }

  async deletePlant(id: string, name: string): Promise<boolean> {
    this.isLoading.set(true);
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
      this.isLoading.set(false);
    }
  }
}
