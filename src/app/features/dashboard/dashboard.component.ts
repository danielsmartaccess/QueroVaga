import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParkingSpaceService } from '../../core/services/parking-space.service';
import { ReservationService } from '../../core/services/reservation.service';
import { ParkingSpace } from '../../core/models/parking-space.model';
import { Reservation } from '../../core/models/reservation.model';
import { ThemeService } from '../../core/services/theme.service';

/**
 * Componente Dashboard
 * 
 * Este componente exibe informações resumidas sobre o sistema:
 * - Total de vagas disponíveis/ocupadas
 * - Reservas recentes
 * - Estatísticas gerais
 * - Links rápidos para as principais funcionalidades
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // Dados para os cards e gráficos no dashboard
  parkingSpaces: ParkingSpace[] = [];
  recentReservations: Reservation[] = [];
  totalSpaces = 0;
  availableSpaces = 0;
  occupiedSpaces = 0;
  reservationsToday = 0;
  loading = true;

  /**
   * @param parkingSpaceService Serviço para obter informações sobre vagas
   * @param reservationService Serviço para obter informações sobre reservas
   * @param themeService Serviço para o tema claro/escuro
   */
  constructor(
    private parkingSpaceService: ParkingSpaceService,
    private reservationService: ReservationService,
    public themeService: ThemeService
  ) {}

  /**
   * Carrega os dados necessários ao inicializar o componente
   */
  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Carrega todos os dados necessários para o dashboard
   */
  private loadDashboardData(): void {
    this.loading = true;
    
    // Carrega dados das vagas de estacionamento
    this.parkingSpaceService.getAllParkingSpaces().subscribe({
      next: (spaces) => {
        this.parkingSpaces = spaces;
        this.totalSpaces = spaces.length;
        this.availableSpaces = spaces.filter(space => !space.is_occupied).length;
        this.occupiedSpaces = this.totalSpaces - this.availableSpaces;
        this.checkAllDataLoaded();
      },
      error: (error) => {
        console.error('Erro ao carregar vagas:', error);
        this.loading = false;
      }
    });
    
    // Carrega dados das reservas recentes
    this.reservationService.getAllReservations().subscribe({
      next: (reservations: Reservation[]) => {
        // Filtra para mostrar apenas as mais recentes
        this.recentReservations = reservations
          .sort((a: Reservation, b: Reservation) => 
            new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime())
          .slice(0, 5);
        
        // Conta reservas para hoje
        const today = new Date().toISOString().split('T')[0];
        this.reservationsToday = reservations.filter(
          (r: Reservation) => r.reservation_date.startsWith(today)
        ).length;
        
        this.checkAllDataLoaded();
      },
      error: (error: any) => {
        console.error('Erro ao carregar reservas:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Verifica se todos os dados foram carregados para desativar o estado de loading
   */
  private checkAllDataLoaded(): void {
    if (this.parkingSpaces.length > 0 && this.recentReservations.length >= 0) {
      this.loading = false;
    }
  }

  /**
   * Atualiza todos os dados do dashboard
   */
  refreshData(): void {
    this.loadDashboardData();
  }
}
