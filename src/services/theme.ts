export type Theme = 'dark' | 'light';

class ThemeService {
  private currentTheme: Theme = 'dark';
  private listeners: ((theme: Theme) => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const savedTheme = localStorage.getItem('tachyon_theme') as Theme | null;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      this.setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('tachyon_theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  public getTheme(): Theme {
    return this.currentTheme;
  }

  public setTheme(theme: Theme) {
    this.currentTheme = theme;
    localStorage.setItem('tachyon_theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    this.listeners.forEach((listener) => listener(theme));
  }

  public toggle(): Theme {
    const next = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  }

  public subscribe(callback: (theme: Theme) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }
}

export const themeService = new ThemeService();
