import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

/**
 * Componente principal da aplicação
 * 
 * Gerencia o layout principal, incluindo o cabeçalho e rodapé,
 * e aplica o tema atual a toda a aplicação.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Vaga Livre';
  
  /**
   * @param authService Serviço de autenticação para gerenciar o estado de login
   * @param themeService Serviço de tema para aplicar o tema escolhido
   */
  constructor(
    public authService: AuthService,
    public themeService: ThemeService
  ) {}
  
  /**
   * Inicializa o tema baseado nas preferências do usuário
   */
  ngOnInit(): void {
    // O tema será automaticamente aplicado pelo serviço ThemeService
  }
}
