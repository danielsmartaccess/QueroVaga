import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Resident, ResidentCreate, ResidentUpdate } from '../models/resident.model';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {
  private apiUrl = '/api/residents';
  
  // Dados fictícios de residentes para teste
  private mockResidents: Resident[] = [
    { id: 1, name: 'Administrador', apartment: 'A101', email: 'admin@example.com', is_admin: true },
    { id: 2, name: 'Usuário Comum', apartment: 'B202', email: 'usuario@example.com', is_admin: false },
    { id: 3, name: 'João Silva', apartment: 'A102', email: 'joao.silva@example.com', is_admin: false },
    { id: 4, name: 'Maria Santos', apartment: 'A103', email: 'maria.santos@example.com', is_admin: false },
    { id: 5, name: 'Pedro Oliveira', apartment: 'A104', email: 'pedro.oliveira@example.com', is_admin: false },
    { id: 6, name: 'Ana Costa', apartment: 'A201', email: 'ana.costa@example.com', is_admin: false },
    { id: 7, name: 'Carlos Pereira', apartment: 'A202', email: 'carlos.pereira@example.com', is_admin: false },
    { id: 8, name: 'Sandra Lima', apartment: 'A203', email: 'sandra.lima@example.com', is_admin: false },
    { id: 9, name: 'Roberto Almeida', apartment: 'A204', email: 'roberto.almeida@example.com', is_admin: false },
    { id: 10, name: 'Juliana Martins', apartment: 'B101', email: 'juliana.martins@example.com', is_admin: false },
    { id: 11, name: 'Lucas Ferreira', apartment: 'B102', email: 'lucas.ferreira@example.com', is_admin: false },
    { id: 12, name: 'Amanda Souza', apartment: 'B103', email: 'amanda.souza@example.com', is_admin: false },
    { id: 13, name: 'Felipe Gomes', apartment: 'B104', email: 'felipe.gomes@example.com', is_admin: false },
    { id: 14, name: 'Camila Ribeiro', apartment: 'B201', email: 'camila.ribeiro@example.com', is_admin: false },
    { id: 15, name: 'Marcos Silva', apartment: 'B203', email: 'marcos.silva@example.com', is_admin: false },
    { id: 16, name: 'Patricia Rocha', apartment: 'B204', email: 'patricia.rocha@example.com', is_admin: false },
    { id: 17, name: 'Gustavo Mendes', apartment: 'C101', email: 'gustavo.mendes@example.com', is_admin: false },
    { id: 18, name: 'Fernanda Santos', apartment: 'C102', email: 'fernanda.santos@example.com', is_admin: false },
    { id: 19, name: 'Ricardo Lima', apartment: 'C103', email: 'ricardo.lima@example.com', is_admin: false },
    { id: 20, name: 'Débora Costa', apartment: 'C104', email: 'debora.costa@example.com', is_admin: false },
    { id: 21, name: 'Bruno Alves', apartment: 'C201', email: 'bruno.alves@example.com', is_admin: false },
    { id: 22, name: 'Jéssica Pereira', apartment: 'C202', email: 'jessica.pereira@example.com', is_admin: false }
  ];
  
  // Flag para usar dados mock em vez de chamar a API real
  private useMockData = true;

  constructor(private http: HttpClient) { }

  getAllResidents(): Observable<Resident[]> {
    if (this.useMockData) {
      return of(this.mockResidents);
    }
    return this.http.get<Resident[]>(this.apiUrl);
  }

  getResidentById(id: number): Observable<Resident> {
    if (this.useMockData) {
      const resident = this.mockResidents.find(r => r.id === id);
      if (resident) {
        return of(resident);
      }
    }
    return this.http.get<Resident>(`${this.apiUrl}/${id}`);
  }

  createResident(resident: ResidentCreate): Observable<Resident> {
    if (this.useMockData) {
      const newResident: Resident = {
        ...resident,
        id: Math.max(...this.mockResidents.map(r => r.id || 0)) + 1
      };
      this.mockResidents.push(newResident);
      return of(newResident);
    }
    return this.http.post<Resident>(this.apiUrl, resident);
  }

  updateResident(id: number, resident: ResidentUpdate): Observable<Resident> {
    if (this.useMockData) {
      const index = this.mockResidents.findIndex(r => r.id === id);
      if (index !== -1) {
        this.mockResidents[index] = { ...this.mockResidents[index], ...resident };
        return of(this.mockResidents[index]);
      }
    }
    return this.http.put<Resident>(`${this.apiUrl}/${id}`, resident);
  }

  deleteResident(id: number): Observable<void> {
    if (this.useMockData) {
      const index = this.mockResidents.findIndex(r => r.id === id);
      if (index !== -1) {
        this.mockResidents.splice(index, 1);
      }
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
