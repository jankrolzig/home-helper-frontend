import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private router = inject(Router);
  private supabase: SupabaseClient;

  private currentUser = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);

  user$ = this.currentUser.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    this.initializeAuth();
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  private async initializeAuth(): Promise<void> {
    try {
      const {
        data: { session },
        error,
      } = await this.supabase.auth.getSession();

      if (error) {
        this.isLoadingSubject.next(false);
        return;
      }

      if (session) {
        this.currentUser.next(session.user);
        this.isAuthenticatedSubject.next(true);

        if (this.router.url === '/login') {
          this.router.navigate(['/dashboard']);
        }
      } else {
        this.isAuthenticatedSubject.next(false);
      }

      this.setupAuthListener();
    } catch (error) {
      this.isAuthenticatedSubject.next(false);
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  private setupAuthListener(): void {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          this.currentUser.next(session!.user);
          this.isAuthenticatedSubject.next(true);
          if (!this.router.url.includes('/dashboard')) {
            this.router.navigate(['/dashboard']);
          }
          break;
        case 'SIGNED_OUT':
          this.currentUser.next(null);
          this.isAuthenticatedSubject.next(false);
          if (!this.router.url.includes('/login')) {
            this.router.navigate(['/login']);
          }
          break;
        case 'TOKEN_REFRESHED':
          break;
        case 'USER_UPDATED':
          if (session) {
            this.currentUser.next(session.user);
          }
          break;
        case 'INITIAL_SESSION':
          break;
      }
    });
  }

  async signInWithGitHub(): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        throw error;
      }
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signOut(): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw error;
      }
      return { success: true, error: null };
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  async getSession() {
    return this.supabase.auth.getSession();
  }

  isLoading(): boolean {
    return this.isLoadingSubject.value;
  }
}
