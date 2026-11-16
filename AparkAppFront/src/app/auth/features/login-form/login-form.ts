import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { LoginCredentials } from '../../auth-models';
import { AuthService } from '../../auth-service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { firstValueFrom } from 'rxjs'; 

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-login-form',
  styleUrl: './login-form.css',
  templateUrl: './login-form.html',
})
export default class LoginForm {
  private readonly client = inject(AuthService);
  private readonly router = inject(Router);
  readonly reason = input<string>('');
  protected readonly erroMsg = signal('');
  private readonly valoresIniciales: LoginCredentials = {
    username: '',
    password: '',
  };
  private readonly formularioVacio = signal<LoginCredentials>({
    ...this.valoresIniciales,
  });

  protected readonly loginForm = form(
    this.formularioVacio,
    (field) => {
      required(field.username, { message: 'Requerido' });
      required(field.password, { message: 'Requerido' });
    },
    {
      submission: {
        action: async (field) => {
          try {
            // Limpiamos errores previos al hacer un nuevo intento
            this.erroMsg.set('');
            
            const data = field().value();
            const res = await firstValueFrom(this.client.login(data));
            
            if (res.token) {
              alert('Inicio de sesión exitoso');
              this.router.navigate(['/']);
            }
          } catch (error) {
            // Manejo visual para el usuario
            if (
              error instanceof HttpErrorResponse &&
              error.status === HttpStatusCode.Unauthorized
            ) {
              this.erroMsg.set('Credenciales inválidas');
            } else {
              this.erroMsg.set('Ocurrió un error inesperado al iniciar sesión.');
            }
            
            // Registro técnico
            console.error('Fallo en el intento de Login:', error);
            
            // Le avisamos a la librería del formulario que la acción falló
            throw error;
          }
        },
        onInvalid: (field) => {
          field().errorSummary()[0].fieldTree().focusBoundControl();
        },
      },
    },
  );

  resetForm() {
    this.loginForm().reset(this.valoresIniciales);
    this.erroMsg.set(''); // Limpiar también el error manual al resetear
  }
}