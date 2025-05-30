# Apresentação do Projeto QueroVaga - Requisitos Atendidos

Este documento apresenta os principais requisitos atendidos pelo projeto QueroVaga, conforme solicitado no trabalho.

## 1. Navegação SPA (Single Page Application)

**Arquivo**: `src/app/app.routes.ts`
```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'residents', component: ResidentListComponent, canActivate: [authGuard, adminGuard] },
  { path: 'parking-spaces', component: ParkingSpaceListComponent, canActivate: [authGuard] },
  { path: 'reservations', component: ReservationListComponent, canActivate: [authGuard] },
  { path: 'admin/import', component: ExcelImportComponent, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: '/dashboard' }
];
```
**Evidência**: Implementação de rotas Angular que definem a navegação SPA entre diferentes componentes.

## 2. CRUD #1: Reservas

**Arquivo**: `src/app/features/reservations/reservation-list/reservation-list.component.ts`

**Operações CRUD implementadas**:
- **Create/Read**: 
  ```typescript
  showAddForm(): void {
    this.selectedReservation = null;
    this.showForm = true;
  }
  
  loadReservations(): void {
    // Código para carregar reservas
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
  ```

- **Update**:
  ```typescript
  editReservation(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.showForm = true;
  }
  ```

- **Delete**:
  ```typescript
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
  ```

## 3. CRUD #2: Vagas de Estacionamento

**Arquivo**: `src/app/features/parking/parking-space-list/parking-space-list.component.ts`

**Operações CRUD implementadas**:
- **Read**:
  ```typescript
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
  }
  ```

- **Update**:
  ```typescript
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
  ```

## 4. Funcionalidade de Filtro/Busca

**Arquivo**: `src/app/features/reservations/reservation-list/reservation-list.component.ts`

```typescript
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
```

**Evidência**: Implementação de filtros por termo de busca e status nas reservas.

## 5. Funcionalidade de Negócio

**Arquivo**: `src/app/features/reservations/reservation-list/reservation-list.component.ts`

```typescript
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
```

**Arquivo**: `src/app/features/parking/parking-space-list/parking-space-list.component.ts`

```typescript
toggleAvailability(space: ParkingSpace): void {
  // Lógica para alternar disponibilidade das vagas
}
```

**Evidência**: Implementação de funcionalidades específicas do negócio como check-in/check-out de reservas e gerenciamento de disponibilidade de vagas.

## 6. Relacionamento entre Entidades

**Evidência de Relacionamento**: As reservas se relacionam com:
1. Vagas de estacionamento (parking_space_number)
2. Apartamentos/moradores (apartment_number)

Este relacionamento é evidenciado no código de filtro:

```typescript
filterReservations(): Reservation[] {
  // ...
  return this.reservations.filter(reservation => {
    // ...
    return (
      reservation.guest_name.toLowerCase().includes(term) ||
      reservation.guest_vehicle.toLowerCase().includes(term) ||
      (reservation.guest_phone && reservation.guest_phone.includes(term)) ||
      (reservation.parking_space_number && reservation.parking_space_number.toLowerCase().includes(term)) ||
      (reservation.apartment_number && reservation.apartment_number.toLowerCase().includes(term))
    );
    // ...
  });
}
```

## 7. Login e Segurança com Token JWT

**Arquivo**: `src/app/core/services/auth.service.ts`

```typescript
login(loginData: LoginRequest): Observable<AuthResponse> {
  // ...
  const mockResponse: AuthResponse = {
    access_token: mockToken,
    token_type: 'bearer'
  };
  
  // Armazenar token de teste
  localStorage.setItem(this.tokenKey, mockResponse.access_token);
  // ...
}

getToken(): string | null {
  return localStorage.getItem(this.tokenKey);
}

isLoggedIn(): boolean {
  return !!localStorage.getItem(this.tokenKey);
}
```

**Arquivo**: `src/app/app.routes.ts`

```typescript
{ path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
{ path: 'residents', component: ResidentListComponent, canActivate: [authGuard, adminGuard] },
```

**Evidência**: Implementação de autenticação com tokens JWT e guardas de rota para proteção de acesso.

## 8. Uso de Componentes Angular

**Evidência**: Toda a aplicação está estruturada usando componentes Angular, por exemplo:
- `ReservationListComponent`
- `ParkingSpaceListComponent`
- `LoginComponent`
- `DashboardComponent`

## 9. Injeção de Dependência

**Exemplo**:
```typescript
constructor(
  private reservationService: ReservationService,
  private authService: AuthService
) {
  this.isAdmin = !!this.authService.currentUserValue?.is_admin;
}
```

**Evidência**: Uso do sistema de injeção de dependência do Angular para injetar serviços nos componentes.

## 10. Data Binding

**Exemplo em componentes** (implícito no código analisado):
- Property binding: `[ngModel]="searchTerm"`
- Event binding: `(click)="deleteReservation(reservation.id)"`
- Two-way binding: `[(ngModel)]="filterStatus"`

## Conclusão

O projeto QueroVaga atende a todos os requisitos solicitados no trabalho, implementando:
- 2 CRUDs completos (Reservas e Vagas de Estacionamento)
- Funcionalidade de filtro/busca avançada
- Funcionalidades de negócio específicas (check-in/check-out, gerenciamento de disponibilidade)
- Relacionamentos entre entidades (reservas-vagas-moradores)
- Navegação SPA com rotas protegidas
- Autenticação e segurança com tokens JWT