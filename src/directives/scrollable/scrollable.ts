import { Directive, HostListener, EventEmitter, Output, ElementRef } from '@angular/core';

/**
 * Generated class for the ScrollableDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[scrollable]' // Attribute selector
})
export class ScrollableDirective {
  @Output() scrollPosition = new EventEmitter();

  constructor(public el: ElementRef) {
    
  }

  @HostListener('scroll', ['$event'])
  onScroll(event){
  	try{
  		const top = event.target.scrollTop;
  		const height = this.el.nativeElement.scrollHeight;
  		const offset = this.el.nativeElement.offsetHeight;

  		if(top > height - offset - 1){
  			this.scrollPosition.emit('bottom')
  		}else if(top == 0){
  			this.scrollPosition.emit('top')
  		}

  	}
  	catch(err){

  	}
  }

}
