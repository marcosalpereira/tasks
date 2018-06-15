import { NgModel } from '@angular/forms';
import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ngModel][appMask]'
})
export class MaskDirective implements OnInit {

  @Input('appMask') appMask: string;
  maxlength: number;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private ngModel: NgModel,
  ) { }

  ngOnInit() {
    this.maxlength = this.appMask.length;
    this.renderer.setAttribute(this.el.nativeElement, 'maxLength', this.maxlength.toString());
  }

  @HostListener('keyup', ['$event'])
  onKeyup($event: any) {
    const value = $event.target.value.replace(/\D/g, '');
    const pad = this.appMask.replace(/\D/g, '').replace(/9/g, '_');
    const maskedValue = value + pad.substring(0, pad.length - value.length);

    // retorna caso pressionado backspace
    if ($event.keyCode === 8) {
      return;
    }

    let maskedValuePos = 0;
    let valor = '';
    for (let i = 0; i < this.appMask.length; i++) {
      if (isNaN(parseInt(this.appMask.charAt(i), 10))) {
        valor += this.appMask.charAt(i);
      } else {
        valor += maskedValue[maskedValuePos++];
      }
    }

    if (valor.indexOf('_') > -1) {
      valor = valor.substr(0, valor.indexOf('_'));
    }

    this.ngModel.control.setValue(valor);
  }

  @HostListener('blur', ['$event'])
  onBlur($event: any) {
    if ($event.target.value.length === this.appMask.length) {
      return;
    }
    $event.target.value = '';
    this.ngModel.control.setValue('');
  }

}