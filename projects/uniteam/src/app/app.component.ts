import { Component, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { StateService } from './core/services/state.service';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { filter } from 'rxjs';

@Component({
  selector: 'isdi-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    @if (shouldShowHeaderAndFooter()) {
    <isdi-header />
    }
    <main>
      <router-outlet />
    </main>
    @if (shouldShowHeaderAndFooter()) {
    <isdi-footer />
    }
  `,
  styles: `
  main {
    min-height: 86vh;
  }`,
})
export class AppComponent implements OnDestroy {
  stateService = inject(StateService);
  router = inject(Router);
  private navigationSubscription;

  constructor() {
    const stringToken = localStorage.getItem('TFD');
    if (stringToken) {
      const { token } = JSON.parse(stringToken);
      this.stateService.setLogin(token);
    }

    this.navigationSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {});
  }

  shouldShowHeaderAndFooter(): boolean {
    const currentRoute = this.router.routerState.snapshot.url;
    return !['/landing', '/login', '/register', '/create-meet'].includes(
      currentRoute
    );
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
