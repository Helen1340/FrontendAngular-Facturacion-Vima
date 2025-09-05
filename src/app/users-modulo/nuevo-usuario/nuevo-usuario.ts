import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nuevo-usuario',
  imports: [ CommonModule, FormsModule, RouterModule, ReactiveFormsModule ],
  templateUrl: './nuevo-usuario.html',
  styleUrl: './nuevo-usuario.css'
})
export class NuevoUsuario {
  usuarioForm: FormGroup;
  sidebarVisible = signal(false);
  showNotification = signal(false);
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      rol: ['', [Validators.required]],
      usuarioActivo: [true],
      permisos: this.fb.group({
        facturas: [false],
        clientes: [false],
        reportes: [false],
        productos: [false],
        contingencias: [false],
        configuraciones: [false]
      })
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para contraseña
  private passwordValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLengthValid = password.length >= 8;

    if (hasUpperCase && hasNumber && isLengthValid) {
      return null;
    }

    return { 'passwordInvalid': true };
  }

  // Validador para confirmar contraseña
  private passwordMatchValidator(form: AbstractControl): {[key: string]: any} | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    }

    // Si las contraseñas coinciden, limpiar el error
    if (confirmPassword.hasError('passwordMismatch')) {
      const errors = confirmPassword.errors;
      delete errors!['passwordMismatch'];
      confirmPassword.setErrors(Object.keys(errors!).length ? errors : null);
    }

    return null;
  }

  toggleSidebar(): void {
    this.sidebarVisible.update((value: any) => !value);
  }

  async onSubmit(): Promise<void> {
    if (this.usuarioForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formData = this.usuarioForm.value;
      console.log('Datos del usuario:', formData);

      // Simular llamada a API
      await this.crearUsuario(formData);

      // Mostrar notificación de éxito
      this.showSuccessNotification();

      // Resetear formulario
      this.resetForm();

    } catch (error) {
      console.error('Error al crear usuario:', error);
      // Aquí podrías mostrar una notificación de error
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private async crearUsuario(userData: any): Promise<void> {
    // Simular delay de API
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }

  private showSuccessNotification(): void {
    this.showNotification.set(true);
    setTimeout(() => {
      this.showNotification.set(false);
    }, 3000);
  }

  private resetForm(): void {
    this.usuarioForm.reset({
      usuarioActivo: true,
      permisos: {
        facturas: false,
        clientes: false,
        reportes: false,
        productos: false,
        contingencias: false,
        configuraciones: false
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched();
      }
    });
  }
}
