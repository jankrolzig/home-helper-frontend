import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  HlmSidebar,
  HlmSidebarContent,
  HlmSidebarGroup,
  HlmSidebarGroupContent,
  HlmSidebarGroupLabel,
  HlmSidebarImports,
  HlmSidebarWrapper,
} from '@spartan-ng/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideHouse,
  lucideInbox,
  lucideLeaf,
  lucideSearch,
  lucideSettings,
} from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlmH1, hlmH3 } from '@spartan-ng/helm/typography';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sidebar',
  imports: [
    HlmSidebarWrapper,
    HlmSidebar,
    HlmSidebarContent,
    HlmSidebarGroupLabel,
    HlmSidebarGroup,
    HlmSidebarGroupContent,
    HlmSidebarImports,
    NgIcon,
    HlmIcon,
    RouterLink,
  ],
  templateUrl: './sidebar.html',
  providers: [
    provideIcons({
      lucideHouse,
      lucideInbox,
      lucideCalendar,
      lucideSearch,
      lucideSettings,
      lucideLeaf,
    }),
  ],
})
export class Sidebar {
  protected readonly _items = [
    {
      title: 'Home',
      url: '#',
      icon: 'lucideHouse',
    },
    {
      title: 'Pflanzen',
      url: 'plants',
      icon: 'lucideLeaf',
    },
  ];
  protected readonly hlmH1 = hlmH1;
  protected readonly hlmH3 = hlmH3;
}
