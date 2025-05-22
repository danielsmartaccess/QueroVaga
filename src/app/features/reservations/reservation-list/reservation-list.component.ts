import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { AuthService } from '../../../core/services/auth.service';
import { Reservation } from '../../../core/models/reservation.model';
import { ReservationFormComponent } from '../reservation-form/reservation-form.component';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ReservationFormComponent],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss'
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = false;
  error = '';
  isAdmin = false;
  showForm = false;
  selectedReservation: Reservation | null = null;
  searchTerm = '';
  filterStatus = 'all';

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) {
    this.isAdmin = !!this.authService.currentUserValue?.is_admin;
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.error = '';

    const observable = this.isAdmin ?
      this.reservationService.getAllReservations() :
      this.reservationService.getMyReservations();

    observable.subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar reservas';
        this.loading = false;
        console.error(error);
      }
    });
  }

  showAddForm(): void {
    this.selectedReservation = null;
    this.showForm = true;
  }

  editReservation(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.showForm = true;
  }

  deleteReservation(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta reserva?')) {
      this.loading = true;
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.loadReservations();
        },
        error: (error) => {
          this.error = 'Erro ao excluir reserva';
          this.loading = false;
          console.error(error);
        }
      });
    }
  }

  onFormSaved(): void {
    this.showForm = false;
    this.loadReservations();
  }

  onFormCancelled(): void {
    this.showForm = false;
  }

  checkInReservation(id: number): void {
    this.loading = true;
    this.reservationService.checkInReservation(id).subscribe({
      next: () => {
        this.loadReservations();
      },
      error: (error) => {
        this.error = 'Erro ao registrar entrada';
        this.loading = false;
        console.error(error);
      }
    });
  }

  checkOutReservation(id: number): void {
    this.loading = true;
    this.reservationService.checkOutReservation(id).subscribe({
      next: () => {
        this.loadReservations();
      },
      error: (error) => {
        this.error = 'Erro ao registrar saída';
        this.loading = false;
        console.error(error);
      }
    });
  }

  filterReservations(): Reservation[] {
    if (!this.searchTerm && this.filterStatus === 'all') {
      return this.reservations;
    }

    return this.reservations.filter(reservation => {
      // Filtro por status
      if (this.filterStatus !== 'all') {
        if (this.filterStatus === 'active' && !reservation.is_active) return false;
        if (this.filterStatus === 'inactive' && reservation.is_active) return false;
      }

      // Filtro por termo de busca
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        return (
          reservation.guest_name.toLowerCase().includes(term) ||
          reservation.guest_vehicle.toLowerCase().includes(term) ||
          (reservation.guest_phone && reservation.guest_phone.includes(term)) ||
          (reservation.parking_space_number && reservation.parking_space_number.toLowerCase().includes(term)) ||
          (reservation.apartment_number && reservation.apartment_number.toLowerCase().includes(term))
        );
      }

      return true;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterStatus = 'all';
  }
}
