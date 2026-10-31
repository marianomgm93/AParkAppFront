import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { registerFormModel, User, userFormModel } from './user';
import { Observable } from 'rxjs';

@Service()
export class UserClient {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:3000/users';
    private readonly authUrl = 'http://localhost:3000/api/auth/register';
    getAll(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl);
    }
    getById(id: string | number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${id}`);
    }
    create(user: registerFormModel): Observable<User> {
        return this.http.post<User>(this.authUrl, user);
    }
    update(id: string | number, user: userFormModel): Observable<User> {
        return this.http.put<User>(`${this.baseUrl}/${id}`, user);
    }
    delete(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
