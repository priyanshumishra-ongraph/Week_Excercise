import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  @Input('appHighlight') highlightColor = '#f3f4f6'; // Default light gray
  
  private originalBackgroundColor: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.originalBackgroundColor = this.el.nativeElement.style.backgroundColor || '';
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.highlightColor);
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.3s ease');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.originalBackgroundColor);
  }
}
