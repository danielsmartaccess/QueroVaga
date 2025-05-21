import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

/**
 * Componente de cabeçalho da aplicação
 * 
 * Este componente é responsável por exibir a barra de navegação no topo da aplicação,
 * controlar as opções de menu, alternar o tema e gerenciar o logout do usuário.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  /**
   * Constructor que injeta os serviços necessários
   * 
   * @param authService Serviço de autenticação para gerenciar o estado de login
   * @param themeService Serviço de tema para alternar entre temas claro/escuro
   */
  constructor(
    public authService: AuthService, 
    public themeService: ThemeService
  ) {}

  /**
   * Realiza o logout do usuário atual
   */
  logout(): void {
    this.authService.logout();
  }
  
  /**
   * Alterna entre os temas claro e escuro
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
