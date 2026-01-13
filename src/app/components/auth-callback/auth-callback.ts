import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.html',
})
export class AuthCallback implements OnInit {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  loading = true;
  error = '';

  async ngOnInit(): Promise<void> {
    console.log('Auth callback component initialized');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const {
        data: { session },
      } = await this.supabaseService.getSession();

      if (session?.user) {
        console.log('Session found, redirecting to dashboard');
        this.router.navigate(['/dashboard']);
      } else {
        console.log('No session found in callback');
        this.error = 'Authentication failed. Please try again.';
        this.loading = false;
      }
    } catch (err: any) {
      console.error('Auth callback error:', err);
      this.error = err.message || 'Authentication failed';
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
