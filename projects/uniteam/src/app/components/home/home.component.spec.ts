import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { Router, Routes, provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StateService, State } from '../../core/services/state.service';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let stateServiceMock: jasmine.SpyObj<StateService>;
  let router: Router;

  beforeEach(async () => {
    stateServiceMock = jasmine.createSpyObj('StateService', [
      'getState',
      'setLogout',
      'setRoutes',
      'constructImageUrl',
      'setDeleteCardState',
    ]);

    stateServiceMock.getState.and.returnValue(
      of({
        loginState: 'logged',
        currentUser: { name: 'Test User' },
      } as unknown as State)
    );

    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule],
      providers: [
        provideRouter([] as Routes),
        { provide: StateService, useValue: stateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
