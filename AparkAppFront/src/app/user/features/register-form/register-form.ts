import { Component, computed, inject, input, output, signal } from '@angular/core';
import { UserClient } from '../../data-access/user-client';
import { User, registerFormModel } from '../../data-access/user';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-register-form',
  styleUrl: './register-form.css',
  templateUrl: './register-form.html',
})
export class RegisterForm {
  private readonly client = inject(UserClient);

  private readonly valoresIniciales: registerFormModel = {
    email: '',
    name: '',
    password: '',
  };

  private readonly formularioVacio = signal<registerFormModel>({
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

          this.client.create(data).subscribe((res) => {
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
