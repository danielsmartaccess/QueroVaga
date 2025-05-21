import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ResidentListComponent } from './features/residents/resident-list/resident-list.component';
import { ParkingSpaceListComponent } from './features/parking/parking-space-list/parking-space-list.component';
import { ReservationListComponent } from './features/reservations/reservation-list/reservation-list.component';
import { ExcelImportComponent } from './features/admin/excel-import/excel-import.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

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
