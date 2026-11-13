import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { User } from './user';
import { Observable } from 'rxjs';
import { RegisterFormModel } from '../../auth/auth-models';

@Service()
export class UserClient {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8080/users';
    private readonly authUrl = 'http://localhost:8080/api/auth/register';
    private readonly loginUrl = 'http://localhost:8080/api/auth/login'
    getAll(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl);
    }
    getById(id: string | number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${id}`);
    }
    update(id: string | number, user: RegisterFormModel): Observable<User> {
        return this.http.put<User>(`${this.baseUrl}/${id}`, user);
    }
    delete(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
    // login(user: LoginFormModel): Observable<{ success: boolean; message: string }> {
    //     return this.http.post<{ success: boolean; message: string }>(this.loginUrl, user);
    // }
}
