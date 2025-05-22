import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthResponse, LoginRequest } from '../models/auth.model';
import { Resident } from '../models/resident.model';

/**
 * Credenciais de teste para login na aplicação
 * Email: admin@example.com
 * Senha: admin123
 * 
 * Email: usuario@example.com
 * Senha: senha123
 */

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api';
  private tokenKey = 'auth_token';
  private currentUserSubject: BehaviorSubject<Resident | null>;
  public currentUser: Observable<Resident | null>;

  // Usuários de teste para facilitar o desenvolvimento
  private testUsers = [
    { username: 'admin@example.com', password: 'admin123', user: { id: 1, name: 'Administrador', apartment: 'A101', email: 'admin@example.com', is_admin: true } },
    { username: 'dani@querovaga.com', password: 'dani1234', user: { id: 2, name: 'Usuário Comum', apartment: 'B202', email: 'dani@querovaga.com', is_admin: false } }
  ];

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Resident | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Resident | null {
    return this.currentUserSubject.value;
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    // Verificar se estamos usando as credenciais de teste
    const testUser = this.testUsers.find(
      user => user.username === loginData.username && user.password === loginData.password
    );

    if (testUser) {
      // Simular login com as credenciais de teste
      console.log('Usando credenciais de teste para login');
      const mockToken = 'test_token_' + Math.random().toString(36).substr(2, 9);
      const mockResponse: AuthResponse = {
        access_token: mockToken,
        token_type: 'bearer'
      };
      
      // Armazenar token de teste
      localStorage.setItem(this.tokenKey, mockResponse.access_token);
      
      // Atualizar usuário atual
      this.currentUserSubject.next(testUser.user);
      
      return of(mockResponse);
    }

    // Caso contrário, tenta fazer login no servidor real
    const formData = new FormData();
    formData.append('username', loginData.username);
    formData.append('password', loginData.password);

    return this.http.post<AuthResponse>(`${this.apiUrl}/token`, formData)
      .pipe(
        tap(response => {
          // Store token in localStorage
          localStorage.setItem(this.tokenKey, response.access_token);
          
          // Get user info and update currentUserSubject
          this.getUserProfile().subscribe();
        }),
        catchError(error => {
          console.error('Erro na autenticação:', error);
          return throwError(() => new Error('Credenciais inválidas. Por favor, tente novamente.'));
        })
      );
  }

  getUserProfile(): Observable<Resident> {
    // Se estamos usando token de teste, retorna um usuário mock
    if (this.getToken()?.startsWith('test_token_')) {
      const userFromToken = this.getUserFromStorage();
      if (userFromToken) {
        return of(userFromToken);
      }
    }

    return this.http.get<Resident>(`${this.apiUrl}/users/me`)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    // Remove token from localStorage
    localStorage.removeItem(this.tokenKey);
    
    // Clear current user
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private getUserFromStorage(): Resident | null {
    const token = this.getToken();
    // Return null if no token exists
    if (!token) {
      return null;
    }
    
    // Se for token de teste, retorna o usuário de teste associado
    if (token.startsWith('test_token_')) {
      // Encontra qual usuário de teste está usando esse token
      // Como não podemos armazenar qual usuário está usando o token,
      // vamos simplificar e verificar se admin está no localStorage
      const isAdmin = localStorage.getItem('is_test_admin') === 'true';
      return isAdmin ? 
        this.testUsers[0].user :  // admin
        this.testUsers[1].user;   // usuário comum
    }
    
    // Tentativa de decodificar token normal
    try {
      // Simplified - in a real app, decode JWT token
      return null; // Would return decoded user
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
}
