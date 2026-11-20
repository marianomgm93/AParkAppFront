import { Component, inject, linkedSignal } from '@angular/core';
import { UserClient } from '../../data-access/user-client';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../data-access/user';

@Component({
  imports: [],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
export default class UserList {
  private readonly client = inject(UserClient);
  private readonly userSource = toSignal(this.client.getAll());

  protected readonly users = linkedSignal<User[]>(() => {
    const users = this.userSource();
    return users ?? [];
  });

  protected getRoleLabel(user: User): string {
    const roles = Array.isArray(user.roles) ? user.roles : [user.roles ?? ''];
    if (roles.includes('ROLE_ADMIN')) return 'Admin';
    if (roles.includes('ROLE_OWNER')) return 'Owner';
    return 'Cliente';
  }

  protected hasRole(user: User, role: string): boolean {
    const roles = Array.isArray(user.roles) ? user.roles : [user.roles ?? ''];
    return roles.includes(role);
  }

  protected selectRole(user: User, roleName: string): void {
    if (this.hasRole(user, roleName)) {
      return;
    }
    this.client.changeRole(user.id, roleName).subscribe({
      next: (updated) => {
        this.users.update((list) =>
          list.map((u) => (String(u.id) === String(updated.id) ? { ...u, roles: updated.roles } : u))
        );
      },
      error: (err) => {
        const msg = err?.error?.message;
        alert(msg ? `Error: ${msg}` : 'No se pudo cambiar el rol.');
      },
    });
  }

  protected changeRole(user: User, roleName: string): void {
    this.selectRole(user, roleName);
  }

  protected toggleStatus(user: User): void {
    this.client.toggleStatus(user.id).subscribe({
      next: (updated) => {
        this.users.update((list) =>
          list.map((u) => (String(u.id) === String(updated.id) ? { ...u, active: updated.active } : u))
        );
      },
      error: (err) => {
        const msg = err?.error?.message;
        alert(msg ? `Error: ${msg}` : 'No se pudo cambiar el estado del usuario.');
      },
    });
  }
}
