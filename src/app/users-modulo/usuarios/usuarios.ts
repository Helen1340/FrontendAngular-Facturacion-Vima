import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { routes } from '../../app.routes';

export interface User {
  id: number;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'inactive';
  lastAccess: Date;
}

@Component({
  selector: 'app-usuarios',
  imports: [ CommonModule, FormsModule, RouterModule ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios {
  users: User[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      role: 'Administrador',
      email: 'juan.perez@email.com',
      status: 'active',
      lastAccess: new Date('2024-03-15')
    },
    {
      id: 2,
      name: 'María García',
      role: 'Usuario',
      email: 'maria.garcia@email.com',
      status: 'active',
      lastAccess: new Date('2024-03-14')
    },
    {
      id: 3,
      name: 'Carlos López',
      role: 'Moderador',
      email: 'carlos.lopez@email.com',
      status: 'inactive',
      lastAccess: new Date('2024-03-10')
    }
  ];

  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedFilter: string = '';
  isSidebarOpen: boolean = false;
  openMenuId: number | null = null;

  filterOptions = [
    { value: '', label: 'Todos' },
    { value: 'nombre', label: 'Nombre' },
    { value: 'rol', label: 'Rol' },
    { value: 'activo', label: 'Estado Activo' },
    { value: 'inactivo', label: 'Estado Inactivo' }
  ];

  ngOnInit() {
    this.filteredUsers = [...this.users];
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleMenu(userId: number, event: Event) {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === userId ? null : userId;
  }

  closeMenus() {
    this.openMenuId = null;
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesFilter = !this.selectedFilter || this.applyFilterCondition(user);

      return matchesSearch && matchesFilter;
    });
  }

  private applyFilterCondition(user: User): boolean {
    switch (this.selectedFilter) {
      case 'nombre':
        return this.searchTerm ? user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      case 'rol':
        return this.searchTerm ? user.role.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      case 'activo':
        return user.status === 'active';
      case 'inactivo':
        return user.status === 'inactive';
      default:
        return true;
    }
  }

  viewUser(userId: number) {
    console.log('Ver usuario:', userId);
    // Implementar navegación o modal
  }

  constructor(private router: Router) {}

  editUser(userId: number) {
    console.log('Editar usuario:', userId);
    this.router.navigate(['/edit-user', userId]);
  }

  deleteUser(userId: number) {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.users = this.users.filter(user => user.id !== userId);
      this.applyFilters();
      console.log('Usuario eliminado:', userId);
    }
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }

  getStatusText(status: string): string {
    return status === 'active' ? 'Activo' : 'Inactivo';
  }
}
