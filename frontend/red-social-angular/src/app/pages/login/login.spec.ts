import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';
import { Auth } from '../../services/auth';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let loginSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    loginSpy = vi.fn().mockReturnValue(throwError(() => ({
      error: { message: 'Credenciales incorrectas' }
    })));

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: Auth, useValue: { login: loginSpy } },
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

  it('should validate the password before calling the API', () => {
    component.identificador = 'usuario';
    component.password = 'abc';

    component.iniciarSesion();

    expect(loginSpy).not.toHaveBeenCalled();
    expect(component.mensajeError).toBe(
      'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número'
    );
  });

  it('should display the login error returned by the server', async () => {
    component.identificador = 'usuario';
    component.password = 'Password1';

    component.iniciarSesion();
    await fixture.whenStable();

    expect(loginSpy).toHaveBeenCalledWith({
      identificador: 'usuario',
      password: 'Password1'
    });
    expect(fixture.nativeElement.querySelector('.mensaje-error')?.textContent)
      .toContain('Credenciales incorrectas');
  });
});
