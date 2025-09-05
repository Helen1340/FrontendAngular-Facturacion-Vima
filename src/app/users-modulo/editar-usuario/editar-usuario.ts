import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  email: string;
  rol: string;
  usuarioActivo: boolean;
  usuarioBloqueado: boolean;
  permisos: {
    facturas: boolean;
    clientes: boolean;
    reportes: boolean;
    productos: boolean;
    contingencias: boolean;
    configuraciones: boolean;
  };
}

@Component({
  selector: 'app-editar-usuario',
  imports: [ CommonModule, FormsModule, RouterModule, ReactiveFormsModule ],
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.css'
})
export class EditarUsuario implements OnInit {
  @Input() usuarioId?: number;
  
  usuarioForm: FormGroup;
  sidebarVisible = signal(false);
  showNotification = signal(false);
  isSubmitting = signal(false);
  isLoading = signal(false);
  originalData: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.usuarioForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // Opcional para edición
      confirmPassword: [''],
      rol: ['', [Validators.required]],
      usuarioActivo: [true],
      usuarioBloqueado: [false],
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

  // Validador personalizado para contraseña (solo si se proporciona)
  private passwordValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.value;
    if (!password) return null; // Opcional en edición

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

    // Solo validar si se está intentando cambiar la contraseña
    if (password.value && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    }

    // Si las contraseñas coinciden o ambas están vacías, limpiar el error
    if (confirmPassword.hasError('passwordMismatch')) {
      const errors = confirmPassword.errors;
      delete errors!['passwordMismatch'];
      confirmPassword.setErrors(Object.keys(errors!).length ? errors : null);
    }

    return null;
  }

  private async loadUserData(): Promise<void> {
    this.isLoading.set(true);
    
    try {
      // Simular carga de datos del usuario
      const userData = await this.getUserData(this.usuarioId || 1);
      this.originalData = userData;
      
      // Llenar el formulario con los datos existentes
      this.usuarioForm.patchValue({
        nombre: userData.nombre,
        usuario: userData.usuario,
        email: userData.email,
        rol: userData.rol,
        usuarioActivo: userData.usuarioActivo,
        usuarioBloqueado: userData.usuarioBloqueado,
        permisos: userData.permisos
      });

      // Agregar validación de contraseña solo si se proporciona
      this.usuarioForm.get('password')?.setValidators([this.passwordValidator]);
      this.usuarioForm.get('password')?.updateValueAndValidity();

    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async getUserData(id: number): Promise<Usuario> {
    // Simular llamada a API con datos de ejemplo
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: id,
          nombre: 'Juan Pérez García',
          usuario: 'jperez',
          email: 'juan.perez@empresa.com',
          rol: 'Administrador',
          usuarioActivo: true,
          usuarioBloqueado: false,
          permisos: {
            facturas: true,
            clientes: true,
            reportes: false,
            productos: true,
            contingencias: false,
            configuraciones: true
          }
        });
      }, 1000);
    });
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
      
      // Si no se proporciona nueva contraseña, eliminarla del objeto
      if (!formData.password) {
        delete formData.password;
        delete formData.confirmPassword;
      }

      console.log('Datos actualizados del usuario:', formData);

      // Simular llamada a API
      await this.updateUser(formData);

      // Mostrar notificación de éxito
      this.showSuccessNotification();

    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      // Aquí podrías mostrar una notificación de error
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private async updateUser(userData: any): Promise<void> {
    // Simular delay de API
    return new Promise(resolve => {
      setTimeout(resolve, 1500);
    });
  }

  cancelar(): void {
    // Confirmar si hay cambios sin guardar
    if (this.hasUnsavedChanges()) {
      const confirmExit = confirm('¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.');
      if (!confirmExit) return;
    }

    // Navegar de vuelta o resetear formulario
    this.router.navigate(['/usuarios']); // Ajusta la ruta según tu routing
  }

  private hasUnsavedChanges(): boolean {
    if (!this.originalData) return false;
    
    const currentData = this.usuarioForm.value;
    return JSON.stringify(currentData) !== JSON.stringify({
      nombre: this.originalData.nombre,
      usuario: this.originalData.usuario,
      email: this.originalData.email,
      rol: this.originalData.rol,
      usuarioActivo: this.originalData.usuarioActivo,
      usuarioBloqueado: this.originalData.usuarioBloqueado,
      permisos: this.originalData.permisos,
      password: '',
      confirmPassword: ''
    });
  }

  private showSuccessNotification(): void {
    this.showNotification.set(true);
    setTimeout(() => {
      this.showNotification.set(false);
    }, 3000);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
    });
  }
}
