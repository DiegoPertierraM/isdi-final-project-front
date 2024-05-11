import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { StateService, UserState } from '../../core/services/state.service';
import { JsonPipe } from '@angular/common';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'isdi-home',
  standalone: true,
  imports: [HeaderComponent, JsonPipe, FooterComponent],
  template: `
    <isdi-header />

    @switch (state.loginState) { @case ('idle') {
    <p>Esperando al usuario</p>
    } @case ('logged') { @if (currentUser) {
    <h2>
      Bienvenido, <strong>{{ currentUser.username }}</strong>
      <img
        src="{{
          this.stateService.constructImageUrl(currentUser.avatar, '200', '200')
        }}"
        alt=""
      />
    </h2>
    } } @case ('error') {
    <p>Error de acceso</p>
    } }
    <isdi-footer />
  `,
  styleUrl: './home.component.css',
})
export default class HomeComponent implements OnInit {
  router = inject(Router);
  stateService = inject(StateService);
  state!: UserState;
  currentUser!: User;

  ngOnInit(): void {
    this.stateService.getUserState().subscribe((state) => {
      this.state = state;
      this.currentUser = state.currentUser as User;
      console.log(this.currentUser);
    });
  }
}
