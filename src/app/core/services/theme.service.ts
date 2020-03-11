import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

export enum Themes {
  brown = 'brown',
  light = 'light',
};
export const THEMES = {
  [Themes.brown]: {
    backgroundColor: '#0e0e0e',
    color: '#FFF0E3',
    stylesHref: './assets/styles/pink-bluegrey.css'
  },
  [Themes.light]: {
    backgroundColor: '#fff',
    color: '#515354',
    stylesHref: './assets/styles/indigo-pink.css'
  }
};
const THEME_STORAGE_KEY = 'currentTheme';
const DEFAULT_THEME = Themes.brown;

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  get currentTheme(): string {
    return localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
  }

  set currentTheme(v: string) {
    localStorage.setItem(THEME_STORAGE_KEY, v);
    this.importStyleTheme();
  }

  get currenThemeStyles(): Record<string, string> {
    return THEMES[this.currentTheme];
  }

  private renderer: Renderer2;
  private link: HTMLLinkElement;

  constructor(
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.importStyleTheme();
  }

  private importStyleTheme(): void {
    if (this.link) {
      document.documentElement.removeChild(this.link);
    }

    this.link = this.renderer.createElement('link');

    this.renderer.setAttribute(this.link, 'rel', 'stylesheet');
    this.renderer.setAttribute(this.link, 'type', 'text/css');
    this.renderer.setAttribute(this.link, 'href', this.currenThemeStyles.stylesHref);

    document.documentElement.appendChild(this.link);
  }

}
