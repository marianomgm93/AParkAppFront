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

  protected readonly users = linkedSignal(() => {
    let users = this.userSource();
    if (!users) {
      return [];
    }
    return users;
  });

  protected banUser(userID: string | number): void {
    this.client.delete(userID).subscribe({
      next: () => {
        this.users.update((users) => users.filter((u) => String(u.id) !== String(userID)));
      },
      error: (err) => console.error('Error al eliminar usuario:', err),
    });
  }
}
