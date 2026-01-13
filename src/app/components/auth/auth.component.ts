import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  error = '';
  successMessage = '';
  returnUrl = '/dashboard';

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/dashboard'
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || '/dashboard';
    });
  }

  async signInWithGitHub() {
    this.loading = true;
    this.error = '';

    const result = await this.supabaseService.signInWithGitHub();

    if (!result.success) {
      this.error = result.error || 'Failed to sign in with GitHub';
      this.loading = false;
    }
  }

  private clearErrors(): void {
    this.error = '';
    this.successMessage = '';
  }
}
