import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { SupabaseService } from './services/supabase.service';
import { AsyncPipe } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, AsyncPipe],
  templateUrl: './app.html',
})
export class App {
  private supabase = inject(SupabaseService);

  isAuthenticated = this.supabase.isAuthenticated$;
}
