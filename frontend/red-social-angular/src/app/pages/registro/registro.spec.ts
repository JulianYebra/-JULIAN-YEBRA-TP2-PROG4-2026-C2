import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Auth } from '../../services/auth';
import { Registro } from './registro';

describe('Registro', () => {
  let component: Registro;
  let fixture: ComponentFixture<Registro>;
  let resultadoRegistro: Observable<unknown>;

  beforeEach(async () => {
    resultadoRegistro = of({});

    await TestBed.configureTestingModule({
      imports: [Registro],
      providers: [
        { provide: Auth, useValue: { registrar: () => resultadoRegistro } },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Registro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stop loading and show success after registration', async () => {
    completarFormularioValido();
    component.registrar();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.mensaje-exito')?.textContent)
      .toContain('¡Tu cuenta fue creada correctamente!');
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('button').textContent)
      .toContain('Registrarme');
  });

  it('should stop loading and show an error when registration fails', async () => {
    resultadoRegistro = throwError(() => ({
      error: { message: 'No se pudo completar el registro' }
    }));
    completarFormularioValido();
    component.registrar();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.mensaje-error')?.textContent)
      .toContain('No se pudo completar el registro');
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('button').textContent)
      .toContain('Registrarme');
  });

  function completarFormularioValido(): void {
    component.nombre = 'Ana';
    component.apellido = 'Perez';
    component.email = 'ana@example.com';
    component.username = 'anaperez';
    component.password = 'Password1';
    component.confirmarPassword = 'Password1';
    component.fechaNacimiento = '2000-01-01';
  }
});
