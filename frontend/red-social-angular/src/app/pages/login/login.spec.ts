import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';
import { Auth } from '../../services/auth';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    const authService = {
      login: () => throwError(() => ({
        error: { message: 'Credenciales incorrectas' }
      }))
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: Auth, useValue: authService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the login error returned by the server', async () => {
    component.iniciarSesion();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.mensaje-error')?.textContent)
      .toContain('Credenciales incorrectas');
  });
});
