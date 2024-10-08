import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RepoUsersService } from '../../core/services/repo.users.service';
import { Router, RouterModule } from '@angular/router';
import { SubmitBtnComponent } from '../shared/submit-btn/submit-btn.component';

@Component({
  selector: 'isdi-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, SubmitBtnComponent],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <section>
        <a href="#" [routerLink]="'/landing'">
          <img
            src="assets/img/icons/close.svg"
            class="close-btn"
            alt="Icono de cerrar formulario"
            width="30"
          />
        </a>
        <h1>
          <img
            src="assets/img/logos/logo-with-text.svg"
            alt="Logo de Uniteam"
            width="80"
          />
        </h1>
      </section>
      <h2>Registro de usuario</h2>
      <p>¿Ya tienes usuario? <a [routerLink]="'/login'">Inicia sesión</a></p>
      <div class="form-control">
        <label>
          <span>Nombre de usuario</span>
          <input type="text" formControlName="username" />
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Email</span>
          <input type="email" formControlName="email" />
        </label>
      </div>
      <div class="form-control password-control">
        <label>
          <span>Contraseña</span>
          <input
            [type]="showPassword ? 'text' : 'password'"
            formControlName="password"
          />
          <button
            type="button"
            class="password-visibility"
            (click)="togglePasswordVisibility()"
          >
            <img
              src="assets/img/icons/{{
                showPassword ? 'see-password' : 'hide-password'
              }}.png"
              alt="Icono de mostrar u ocultar contraseña"
              width="25"
            />
          </button>
        </label>
      </div>
      <div class="form-control file-control">
        <label class="custom-file-upload">
          <span>Avatar</span>
          <input
            class="custom-file-input"
            type="file"
            #avatar
            (change)="onFileChange()"
          />
        </label>
        @if (imageUrl) {
        <div class="input-img-container">
          <img class="input-img" src="{{ imageUrl }}" alt="Selected Image" />
        </div>
        }
      </div>
      <div class="form-control">
        <label>
          <span>Fecha de nacimiento</span>
          <input type="date" formControlName="birthDate" />
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Ubicación</span>
          <input type="text" formControlName="location" />
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Género</span>
          <select name="gender" formControlName="gender">
            <option value="">-- Elige una opción --</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="unspecified">Prefiero no especificar</option>
          </select>
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Bio</span>
          <input type="text" formControlName="bio" />
        </label>
      </div>
      <isdi-submit-btn
        [label]="'Registrarse'"
        [disabled]="registerForm.invalid"
      />
    </form>
  `,
  styleUrl: './register.component.css',
})
export default class RegisterComponent {
  private fb = inject(FormBuilder);
  private repo = inject(RepoUsersService);
  private router = inject(Router);
  registerForm: FormGroup;
  imageUrl: string | null = null;
  @ViewChild('avatar') avatar!: ElementRef;
  showPassword = false;

  constructor() {
    this.imageUrl =
      'https://res.cloudinary.com/dehkeqyua/image/upload/w_80,h_80,c_fill/v1715275478/uniteam/sample.webp';
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      avatar: [null],
      birthDate: [null],
      location: [''],
      gender: ['', Validators.required],
      bio: [''],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onFileChange() {
    const htmlElement: HTMLInputElement = this.avatar.nativeElement;
    const file = htmlElement.files![0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.registerForm.patchValue({ avatar: file });
  }

  onSubmit() {
    console.log(this.registerForm.value);
    const fd = new FormData();
    fd.append('username', this.registerForm.value.username);
    fd.append('email', this.registerForm.value.email);
    fd.append('password', this.registerForm.value.password);
    fd.append('birthDate', this.registerForm.value.birthDate);
    fd.append('avatar', this.registerForm.value.avatar);
    fd.append('location', this.registerForm.value.location);
    fd.append('gender', this.registerForm.value.gender);
    fd.append('bio', this.registerForm.value.bio);

    return this.repo.create(fd).subscribe((data) => {
      console.log(data);
      this.router.navigate(['/login']);
    });
  }
}
