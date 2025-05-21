import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ParkingSpaceService } from '../../../core/services/parking-space.service';
import { AuthService } from '../../../core/services/auth.service';
import { ParkingSpace } from '../../../core/models/parking-space.model';

@Component({
  selector: 'app-parking-space-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './parking-space-list.component.html',
  styleUrl: './parking-space-list.component.scss'
})
export class ParkingSpaceListComponent implements OnInit {
  parkingSpaces: ParkingSpace[] = [];
  myParkingSpaces: ParkingSpace[] = [];
  availableParkingSpaces: ParkingSpace[] = [];
  loading = false;
  error = '';
  isAdmin = false;
  showMySpaces = true;

  constructor(
    private parkingSpaceService: ParkingSpaceService,
    private authService: AuthService
  ) {
    this.isAdmin = !!this.authService.currentUserValue?.is_admin;
  }

  ngOnInit(): void {
    this.loadParkingSpaces();
  }

  loadParkingSpaces(): void {
    this.loading = true;
    this.error = '';

    if (this.isAdmin) {
      // Admin can see all parking spaces
      this.parkingSpaceService.getAllParkingSpaces().subscribe({
        next: (data) => {
          this.parkingSpaces = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao carregar vagas de estacionamento';
          this.loading = false;
        }
      });
    } else {
      // Regular users see only their own spaces and available spaces
      this.parkingSpaceService.getMyParkingSpaces().subscribe({
        next: (data) => {
          this.myParkingSpaces = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao carregar suas vagas de estacionamento';
          this.loading = false;
        }
      });
    }

    // Load available parking spaces
    this.parkingSpaceService.getAvailableParkingSpaces().subscribe({
      next: (data) => {
        this.availableParkingSpaces = data;
      },
      error: (error) => {
        console.error('Erro ao carregar vagas disponíveis', error);
      }
    });
  }

  toggleAvailability(space: ParkingSpace): void {
    this.loading = true;
    this.parkingSpaceService.toggleAvailability(space.id!, !space.is_available).subscribe({
      next: (updatedSpace) => {
        // Update the space in the list
        if (this.isAdmin) {
          const index = this.parkingSpaces.findIndex(s => s.id === updatedSpace.id);
          if (index !== -1) {
            this.parkingSpaces[index] = updatedSpace;
          }
        } else {
          const index = this.myParkingSpaces.findIndex(s => s.id === updatedSpace.id);
          if (index !== -1) {
            this.myParkingSpaces[index] = updatedSpace;
          }
        }
        
        // Update available spaces list
        this.loadParkingSpaces();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao atualizar disponibilidade da vaga';
        this.loading = false;
      }
    });
  }
}
