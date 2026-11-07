import { Component, computed, inject, input, output, signal } from '@angular/core';
import { UserClient } from '../../../user/data-access/user-client';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { RegisterFormModel } from '../../auth-models';
import { AuthService } from '../../auth-service';

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-register-form',
  styleUrl: './register-form.css',
  templateUrl: './register-form.html',
})
export class RegisterForm {
  private readonly client = inject(AuthService);

  private readonly valoresIniciales: RegisterFormModel = {
    email: '',
    name: '',
    password: '',
  };

  private readonly formularioVacio = signal<RegisterFormModel>({
    ...this.valoresIniciales,
  });

  protected readonly registerForm = form(
    this.formularioVacio,
    (field) => {
      required(field.email, { message: 'Requerido' });
      email(field.email, { message: 'Formato de correo inválido' });
      required(field.name, { message: 'Requerido' });
      minLength(field.name, 3, { message: 'Mínimo 3 caracteres' });
      required(field.password, { message: 'Requerido' });
      minLength(field.password, 6, { message: 'Mínimo 6 caracteres' });
    },
    {
      submission: {
        action: async (field) => {
          const data = field().value();

          this.client.register(data).subscribe((res) => {
            alert('Se ha registrado correctamente');
            this.resetForm();
          });
        },
      },
    },
  );

  resetForm() {
    this.registerForm().reset({
      ...this.valoresIniciales,
    });
  }
}
