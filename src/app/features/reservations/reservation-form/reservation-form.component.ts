import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reservation, ReservationCreate, ReservationUpdate } from '../../../core/models/reservation.model';
import { ParkingSpace } from '../../../core/models/parking-space.model';
import { Resident } from '../../../core/models/resident.model';
import { ParkingSpaceService } from '../../../core/services/parking-space.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss'
})
export class ReservationFormComponent implements OnInit {
  @Input() reservation: Reservation | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  reservationForm: FormGroup;
  availableParkingSpaces: ParkingSpace[] = [];
  isSubmitting = false;
  errorMessage = '';
  isAdmin = false;
  currentResident: Resident | null = null;

  constructor(
    private fb: FormBuilder,
    private parkingSpaceService: ParkingSpaceService,
    private reservationService: ReservationService,
    private authService: AuthService
  ) {
    this.reservationForm = this.createForm();
    this.isAdmin = !!this.authService.currentUserValue?.is_admin;
    this.currentResident = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadAvailableParkingSpaces();
    
    if (this.reservation) {
      this.patchForm();
    } else if (this.currentResident) {
      // Pre-fill resident information if available
      this.reservationForm.patchValue({
        resident_id: this.currentResident.id,
        resident_phone: this.currentResident.phone || '',
        apartment_number: this.currentResident.apartment
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      parking_space_id: ['', Validators.required],
      guest_name: ['', Validators.required],
      guest_vehicle: ['', Validators.required],
      guest_phone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      resident_phone: ['', Validators.pattern(/^\d{10,11}$/)],
      resident_id: [null],
      apartment_number: [{value: '', disabled: true}],
      reservation_date: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

  patchForm(): void {
    if (this.reservation) {
      this.reservationForm.patchValue({
        parking_space_id: this.reservation.parking_space_id,
        guest_name: this.reservation.guest_name,
        guest_vehicle: this.reservation.guest_vehicle,
        guest_phone: this.reservation.guest_phone || '',
        resident_phone: this.reservation.resident_phone || '',
        resident_id: this.reservation.resident_id,
        apartment_number: this.reservation.apartment_number,
        reservation_date: this.reservation.reservation_date
      });
    }
  }

  loadAvailableParkingSpaces(): void {
    this.parkingSpaceService.getAvailableParkingSpaces().subscribe({
      next: (spaces) => {
        this.availableParkingSpaces = spaces;
        
        // If editing, include the current space even if not available
        if (this.reservation && this.reservation.parking_space_id) {
          const currentSpaceExists = spaces.some(space => space.id === this.reservation!.parking_space_id);
          
          if (!currentSpaceExists) {
            this.parkingSpaceService.getParkingSpaceById(this.reservation.parking_space_id).subscribe({
              next: (space) => {
                if (space) {
                  this.availableParkingSpaces.push(space);
                }
              }
            });
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar vagas disponíveis';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) {
      this.markFormGroupTouched(this.reservationForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValues = this.reservationForm.value;
    
    if (this.reservation && this.reservation.id) {
      // Update existing reservation
      const updateData: ReservationUpdate = {
        guest_name: formValues.guest_name,
        guest_vehicle: formValues.guest_vehicle,
        guest_phone: formValues.guest_phone,
        resident_phone: formValues.resident_phone
      };

      this.reservationService.updateReservation(this.reservation.id, updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.saved.emit();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Erro ao atualizar reserva';
          console.error(error);
        }
      });
    } else {
      // Create new reservation
      const createData: ReservationCreate = {
        parking_space_id: formValues.parking_space_id,
        guest_name: formValues.guest_name,
        guest_vehicle: formValues.guest_vehicle,
        guest_phone: formValues.guest_phone,
        resident_phone: formValues.resident_phone,
        resident_id: formValues.resident_id
      };

      this.reservationService.createReservation(createData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.saved.emit();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Erro ao criar reserva';
          console.error(error);
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  // Helper to mark all form controls as touched to trigger validation
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
