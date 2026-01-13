import { SupabaseService } from '../services/supabase.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (_route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  if (supabaseService.isLoading()) {
    await firstValueFrom(supabaseService.isLoading$.pipe(filter((isLoading) => !isLoading)));
  }

  const isAuthenticated = supabaseService.isAuthenticated();

  if (isAuthenticated) {
    return true;
  }

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};

export const publicGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  if (supabaseService.isLoading()) {
    console.log('⏳ Auth still loading, waiting...');

    await firstValueFrom(supabaseService.isLoading$.pipe(filter((isLoading) => !isLoading)));
  }

  const isAuthenticated = supabaseService.isAuthenticated();

  if (isAuthenticated) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
