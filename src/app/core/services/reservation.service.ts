import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Reservation, ReservationCreate, ReservationUpdate } from '../models/reservation.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = '/api/reservations';

  // Função para gerar uma data aleatória nos últimos 7 dias
  private getRandomPastDate(daysAgo = 7): string {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date.toISOString().split('T')[0];
  }

  // Função para gerar uma data aleatória nos próximos 7 dias
  private getRandomFutureDate(daysAhead = 7): string {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
    return date.toISOString().split('T')[0];
  }

  // Dados fictícios de reservas para teste
  private mockReservations: Reservation[] = [
    { 
      id: 1, 
      parking_space_id: 1, 
      parking_space_number: 'A01', 
      guest_name: 'Visitante Silva', 
      guest_vehicle: 'Ford Ka - XYZ-1234', 
      reservation_date: this.getRandomFutureDate(), 
      date: this.getRandomFutureDate(), 
      is_active: true, 
      apartment_number: 'A101', 
      status: 'ATIVA' 
    },
    { 
      id: 2, 
      parking_space_id: 3, 
      parking_space_number: 'A03', 
      guest_name: 'Visitante Oliveira', 
      guest_vehicle: 'Honda Civic - ABC-5678', 
      reservation_date: this.getRandomPastDate(), 
      date: this.getRandomPastDate(),
      check_in_time: '10:30',
      check_out_time: '15:45',
      is_active: false, 
      apartment_number: 'A102', 
      status: 'CONCLUÍDA' 
    },
    { 
      id: 3, 
      parking_space_id: 5, 
      parking_space_number: 'A05', 
      guest_name: 'Visitante Ferreira', 
      guest_vehicle: 'Toyota Corolla - DEF-9012', 
      reservation_date: this.getRandomFutureDate(), 
      date: this.getRandomFutureDate(), 
      is_active: true, 
      apartment_number: 'A104', 
      status: 'ATIVA' 
    },
    { 
      id: 4, 
      parking_space_id: 7, 
      parking_space_number: 'A07', 
      guest_name: 'Visitante Costa', 
      guest_vehicle: 'Fiat Uno - GHI-3456', 
      reservation_date: this.getRandomPastDate(), 
      date: this.getRandomPastDate(),
      check_in_time: '09:15',
      check_out_time: '17:30',
      is_active: false, 
      apartment_number: 'A202', 
      status: 'CONCLUÍDA' 
    },
    { 
      id: 5, 
      parking_space_id: 9, 
      parking_space_number: 'B01', 
      guest_name: 'Visitante Santos', 
      guest_vehicle: 'Chevrolet Onix - JKL-7890', 
      reservation_date: this.getRandomFutureDate(), 
      date: this.getRandomFutureDate(),
      is_active: true, 
      apartment_number: 'A204', 
      status: 'ATIVA' 
    },
    { 
      id: 6, 
      parking_space_id: 11, 
      parking_space_number: 'B03', 
      guest_name: 'Visitante Martins', 
      guest_vehicle: 'Hyundai HB20 - MNO-1234', 
      reservation_date: this.getRandomPastDate(), 
      date: this.getRandomPastDate(),
      check_in_time: '14:00',
      check_out_time: '18:20',
      is_active: false, 
      apartment_number: 'B102', 
      status: 'CONCLUÍDA' 
    },
    { 
      id: 7, 
      parking_space_id: 13, 
      parking_space_number: 'B05', 
      guest_name: 'Visitante Rocha', 
      guest_vehicle: 'Volkswagen Gol - PQR-5678', 
      reservation_date: this.getRandomFutureDate(), 
      date: this.getRandomFutureDate(), 
      is_active: true, 
      apartment_number: 'B104', 
      status: 'ATIVA' 
    },
    { 
      id: 8, 
      parking_space_id: 15, 
      parking_space_number: 'B07', 
      guest_name: 'Visitante Ribeiro', 
      guest_vehicle: 'Nissan Versa - STU-9012', 
      reservation_date: this.getRandomPastDate(), 
      date: this.getRandomPastDate(),
      check_in_time: '11:45',
      check_out_time: '16:10',
      is_active: false, 
      apartment_number: 'B203', 
      status: 'CONCLUÍDA' 
    },
    { 
      id: 9, 
      parking_space_id: 17, 
      parking_space_number: 'C01', 
      guest_name: 'Visitante Almeida', 
      guest_vehicle: 'Renault Kwid - VWX-3456', 
      reservation_date: this.getRandomFutureDate(), 
      date: this.getRandomFutureDate(), 
      is_active: true, 
      apartment_number: 'C101', 
      status: 'ATIVA' 
    },
    { 
      id: 10, 
      parking_space_id: 19, 
      parking_space_number: 'C03', 
      guest_name: 'Visitante Lima', 
      guest_vehicle: 'Jeep Renegade - YZA-7890', 
      reservation_date: this.getRandomPastDate(), 
      date: this.getRandomPastDate(),
      check_in_time: '10:00',
      check_out_time: '19:30',
      is_active: false, 
      apartment_number: 'C103', 
      status: 'CONCLUÍDA' 
    },
    { 
      id: 11, 
      parking_space_id: 21, 
      parking_space_number: 'C05', 
      guest_name: 'Visitante Souza', 
      guest_vehicle: 'Mitsubishi L200 - BCD-1234', 
      reservation_date: this.getRandomFutureDate(), 
      date: this.getRandomFutureDate(), 
      is_active: true, 
      apartment_number: 'C201', 
      status: 'ATIVA' 
    }
  ];
  
  // Flag para usar dados mock em vez de chamar a API real
  private useMockData = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAllReservations(): Observable<Reservation[]> {
    if (this.useMockData) {
      return of(this.mockReservations);
    }
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getActiveReservations(): Observable<Reservation[]> {
    if (this.useMockData) {
      return of(this.mockReservations.filter(reservation => reservation.is_active));
    }
    return this.http.get<Reservation[]>(`${this.apiUrl}/active`);
  }

  getMyReservations(): Observable<Reservation[]> {
    if (this.useMockData) {
      const currentUser = this.authService.currentUserValue;
      // Aqui estamos filtrando reservas que são do apartamento do usuário atual (simulando)
      if (currentUser) {
        return of(this.mockReservations.filter(
          res => res.apartment_number === currentUser.apartment
        ));
      }
      return of([]);
    }
    return this.http.get<Reservation[]>(`${this.apiUrl}/my-reservations`);
  }

  getReservationById(id: number): Observable<Reservation> {
    if (this.useMockData) {
      const reservation = this.mockReservations.find(r => r.id === id);
      if (reservation) {
        return of(reservation);
      }
    }
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  createReservation(reservation: ReservationCreate): Observable<Reservation> {
    if (this.useMockData) {
      const currentUser = this.authService.currentUserValue;
      const parkingSpace = this.mockReservations.find(r => r.parking_space_id === reservation.parking_space_id);
      
      const newReservation: Reservation = {
        ...reservation,
        id: Math.max(...this.mockReservations.map(r => r.id || 0)) + 1,
        reservation_date: new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        is_active: true,
        status: 'ATIVA',
        apartment_number: currentUser?.apartment || 'Desconhecido',
        parking_space_number: parkingSpace?.parking_space_number || '???'
      };
      
      this.mockReservations.push(newReservation);
      return of(newReservation);
    }
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  updateReservation(id: number, reservation: ReservationUpdate): Observable<Reservation> {
    if (this.useMockData) {
      const index = this.mockReservations.findIndex(r => r.id === id);
      if (index !== -1) {
        this.mockReservations[index] = { ...this.mockReservations[index], ...reservation };
        return of(this.mockReservations[index]);
      }
    }
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  checkInReservation(id: number): Observable<Reservation> {
    if (this.useMockData) {
      const index = this.mockReservations.findIndex(r => r.id === id);
      if (index !== -1) {
        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        this.mockReservations[index].check_in_time = timeString;
        return of(this.mockReservations[index]);
      }
    }
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/check-in`, {});
  }

  checkOutReservation(id: number): Observable<Reservation> {
    if (this.useMockData) {
      const index = this.mockReservations.findIndex(r => r.id === id);
      if (index !== -1) {
        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        this.mockReservations[index].check_out_time = timeString;
        this.mockReservations[index].is_active = false;
        this.mockReservations[index].status = 'CONCLUÍDA';
        return of(this.mockReservations[index]);
      }
    }
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/check-out`, {});
  }

  cancelReservation(id: number): Observable<void> {
    if (this.useMockData) {
      const index = this.mockReservations.findIndex(r => r.id === id);
      if (index !== -1) {
        this.mockReservations.splice(index, 1);
      }
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
