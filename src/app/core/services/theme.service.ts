import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Serviço de gerenciamento de temas da aplicação
 * 
 * Este serviço controla a alternância entre temas claro e escuro na aplicação.
 * Ele armazena a preferência do usuário no localStorage e aplica o tema escolhido
 * através de classes CSS no elemento <body>.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Renderer para manipular o DOM de forma segura
  private renderer: Renderer2;
  
  // Chave usada para armazenar a preferência de tema no localStorage
  private readonly THEME_KEY = 'querovaga_theme';
  
  // Subject para controlar e notificar sobre mudanças no tema atual
  private darkThemeSubject: BehaviorSubject<boolean>;
  
  // Observable público para componentes se inscreverem e reagirem às mudanças de tema
  public darkTheme$: Observable<boolean>;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    
    // Recupera a preferência de tema do localStorage ou usa a preferência do sistema
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Define o tema inicial baseado na preferência salva ou do sistema
    const initialDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    // Inicializa o subject com o valor inicial
    this.darkThemeSubject = new BehaviorSubject<boolean>(initialDarkMode);
    this.darkTheme$ = this.darkThemeSubject.asObservable();
    
    // Aplica o tema inicial
    this.updateTheme(initialDarkMode);
  }

  /**
   * Alterna entre os temas claro e escuro
   */
  toggleTheme(): void {
    const newTheme = !this.darkThemeSubject.value;
    this.updateTheme(newTheme);
  }

  /**
   * Aplica um tema específico (claro ou escuro)
   * 
   * @param isDark true para o tema escuro, false para o tema claro
   */
  setTheme(isDark: boolean): void {
    this.updateTheme(isDark);
  }

  /**
   * Atualiza o tema na aplicação
   * 
   * @param isDark true para aplicar tema escuro, false para tema claro
   */
  private updateTheme(isDark: boolean): void {
    // Salva a preferência no localStorage
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
    
    // Atualiza o subject para notificar os observadores
    this.darkThemeSubject.next(isDark);
    
    // Aplica a classe apropriada ao elemento body
    if (isDark) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }
}
