import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ParkingSpace, ParkingSpaceCreate, ParkingSpaceUpdate } from '../models/parking-space.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ParkingSpaceService {
  private apiUrl = '/api/parking-spaces';

  // Dados fictícios de vagas de estacionamento para teste
  private mockParkingSpaces: ParkingSpace[] = [
    { id: 1, space_number: 'A01', owner_id: 1, owner_name: 'Administrador', apartment_number: 'A101', is_available: true, is_occupied: false },
    { id: 2, space_number: 'A02', owner_id: 2, owner_name: 'Usuário Comum', apartment_number: 'B202', is_available: false, is_occupied: true, vehicle_plate: 'ABC1234' },
    { id: 3, space_number: 'A03', owner_id: 3, owner_name: 'João Silva', apartment_number: 'A102', is_available: true, is_occupied: false },
    { id: 4, space_number: 'A04', owner_id: 4, owner_name: 'Maria Santos', apartment_number: 'A103', is_available: false, is_occupied: true, vehicle_plate: 'DEF5678' },
    { id: 5, space_number: 'A05', owner_id: 5, owner_name: 'Pedro Oliveira', apartment_number: 'A104', is_available: true, is_occupied: false },
    { id: 6, space_number: 'A06', owner_id: 6, owner_name: 'Ana Costa', apartment_number: 'A201', is_available: false, is_occupied: false },
    { id: 7, space_number: 'A07', owner_id: 7, owner_name: 'Carlos Pereira', apartment_number: 'A202', is_available: true, is_occupied: false },
    { id: 8, space_number: 'A08', owner_id: 8, owner_name: 'Sandra Lima', apartment_number: 'A203', is_available: false, is_occupied: true, vehicle_plate: 'GHI9012' },
    { id: 9, space_number: 'B01', owner_id: 9, owner_name: 'Roberto Almeida', apartment_number: 'A204', is_available: true, is_occupied: false },
    { id: 10, space_number: 'B02', owner_id: 10, owner_name: 'Juliana Martins', apartment_number: 'B101', is_available: false, is_occupied: false },
    { id: 11, space_number: 'B03', owner_id: 11, owner_name: 'Lucas Ferreira', apartment_number: 'B102', is_available: true, is_occupied: false },
    { id: 12, space_number: 'B04', owner_id: 12, owner_name: 'Amanda Souza', apartment_number: 'B103', is_available: false, is_occupied: true, vehicle_plate: 'JKL3456' },
    { id: 13, space_number: 'B05', owner_id: 13, owner_name: 'Felipe Gomes', apartment_number: 'B104', is_available: true, is_occupied: false },
    { id: 14, space_number: 'B06', owner_id: 14, owner_name: 'Camila Ribeiro', apartment_number: 'B201', is_available: false, is_occupied: false },
    { id: 15, space_number: 'B07', owner_id: 15, owner_name: 'Marcos Silva', apartment_number: 'B203', is_available: true, is_occupied: false },
    { id: 16, space_number: 'B08', owner_id: 16, owner_name: 'Patricia Rocha', apartment_number: 'B204', is_available: false, is_occupied: true, vehicle_plate: 'MNO7890' },
    { id: 17, space_number: 'C01', owner_id: 17, owner_name: 'Gustavo Mendes', apartment_number: 'C101', is_available: true, is_occupied: false },
    { id: 18, space_number: 'C02', owner_id: 18, owner_name: 'Fernanda Santos', apartment_number: 'C102', is_available: false, is_occupied: false },
    { id: 19, space_number: 'C03', owner_id: 19, owner_name: 'Ricardo Lima', apartment_number: 'C103', is_available: true, is_occupied: false },
    { id: 20, space_number: 'C04', owner_id: 20, owner_name: 'Débora Costa', apartment_number: 'C104', is_available: false, is_occupied: true, vehicle_plate: 'PQR1234' },
    { id: 21, space_number: 'C05', owner_id: 21, owner_name: 'Bruno Alves', apartment_number: 'C201', is_available: true, is_occupied: false },
    { id: 22, space_number: 'C06', owner_id: 22, owner_name: 'Jéssica Pereira', apartment_number: 'C202', is_available: false, is_occupied: false }
  ];

  // Flag para usar dados mock em vez de chamar a API real
  private useMockData = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAllParkingSpaces(): Observable<ParkingSpace[]> {
    if (this.useMockData) {
      return of(this.mockParkingSpaces);
    }
    return this.http.get<ParkingSpace[]>(this.apiUrl);
  }

  getMyParkingSpaces(): Observable<ParkingSpace[]> {
    if (this.useMockData) {
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        return of(this.mockParkingSpaces.filter(space => space.owner_id === currentUser.id));
      }
      return of([]);
    }
    return this.http.get<ParkingSpace[]>(`${this.apiUrl}/my-spaces`);
  }

  getAvailableParkingSpaces(): Observable<ParkingSpace[]> {
    if (this.useMockData) {
      return of(this.mockParkingSpaces.filter(space => space.is_available && !space.is_occupied));
    }
    return this.http.get<ParkingSpace[]>(`${this.apiUrl}/available`);
  }

  getParkingSpaceById(id: number): Observable<ParkingSpace> {
    if (this.useMockData) {
      const space = this.mockParkingSpaces.find(s => s.id === id);
      if (space) {
        return of(space);
      }
    }
    return this.http.get<ParkingSpace>(`${this.apiUrl}/${id}`);
  }

  createParkingSpace(space: ParkingSpaceCreate): Observable<ParkingSpace> {
    if (this.useMockData) {
      const newSpace: ParkingSpace = {
        ...space,
        id: Math.max(...this.mockParkingSpaces.map(s => s.id || 0)) + 1,
        is_occupied: false
      };
      this.mockParkingSpaces.push(newSpace);
      return of(newSpace);
    }
    return this.http.post<ParkingSpace>(this.apiUrl, space);
  }

  updateParkingSpace(id: number, space: ParkingSpaceUpdate): Observable<ParkingSpace> {
    if (this.useMockData) {
      const index = this.mockParkingSpaces.findIndex(s => s.id === id);
      if (index !== -1) {
        this.mockParkingSpaces[index] = { ...this.mockParkingSpaces[index], ...space };
        return of(this.mockParkingSpaces[index]);
      }
    }
    return this.http.put<ParkingSpace>(`${this.apiUrl}/${id}`, space);
  }

  deleteParkingSpace(id: number): Observable<void> {
    if (this.useMockData) {
      const index = this.mockParkingSpaces.findIndex(s => s.id === id);
      if (index !== -1) {
        this.mockParkingSpaces.splice(index, 1);
      }
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleAvailability(id: number, isAvailable?: boolean): Observable<ParkingSpace> {
    if (this.useMockData) {
      const index = this.mockParkingSpaces.findIndex(s => s.id === id);
      if (index !== -1) {
        this.mockParkingSpaces[index].is_available = isAvailable !== undefined ? 
          isAvailable : !this.mockParkingSpaces[index].is_available;
        return of(this.mockParkingSpaces[index]);
      }
    }
    return this.http.put<ParkingSpace>(`${this.apiUrl}/${id}/toggle-availability`, 
      isAvailable !== undefined ? { is_available: isAvailable } : {});
  }
}
