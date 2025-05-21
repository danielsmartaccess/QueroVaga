import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

/**
 * Componente de rodapé da aplicação
 * 
 * Exibe informações sobre a aplicação, links úteis,
 * e a informação de copyright com o ano atual.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  /** Ano atual para exibição do copyright */
  currentYear = new Date().getFullYear();
  
  /**
   * @param themeService Serviço de tema para exibir o rodapé de acordo com o tema atual
   */
  constructor(public themeService: ThemeService) {}
}
