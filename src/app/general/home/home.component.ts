import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fade', [
      state('hidden', style({
        'opacity': '0',
        'transform': 'scale(0)'
      })),
      state('shown', style({
        'opacity': '1',
        'transform': 'scale(1)'
      })),
      transition('hidden <=> shown', animate('0.3s ease-in-out'))
    ])
  ]
})
export class HomeComponent implements OnInit {

  @ViewChild('firstIndicator') firstIndicator: ElementRef;
  @ViewChild('secondIndicator') secondIndicator: ElementRef;
  @ViewChild('thirdIndicator') thirdIndicator: ElementRef;

  firstSlideState: string = 'shown';
  secondSlideState: string = 'hidden';
  thirdSlideState: string = 'hidden';

  constructor(private renderer: Renderer2){}

  ngOnInit() {
    let counter = 0;
    setInterval(() => {
      if(counter == 0) {
        this.showFirstSlide(this.firstIndicator.nativeElement);
        counter ++;
        return;
      }
      if(counter == 1) {
        this.showSecondSlide(this.secondIndicator.nativeElement);
        counter ++;
        return;
      }
      if(counter == 2) {
        this.showThirdSlide(this.thirdIndicator.nativeElement);
        counter = 0;
        return;
      }
    }, 3000)
  }


  showFirstSlide(firstIndicator) {
    if(!firstIndicator.classList.contains('activeIndicator')) {
      this.renderer.addClass(firstIndicator, 'activeIndicator');
      this.renderer.removeClass(this.secondIndicator.nativeElement, 'activeIndicator');
      this.renderer.removeClass(this.thirdIndicator.nativeElement, 'activeIndicator');
      this.firstSlideState = 'shown';
      this.secondSlideState = 'hidden';
      this.thirdSlideState = 'hidden';
    }
  }

  showSecondSlide(secondIndicator) {
    if(!secondIndicator.classList.contains('activeIndicator')) {
      this.renderer.addClass(secondIndicator, 'activeIndicator');
      this.renderer.removeClass(this.firstIndicator.nativeElement, 'activeIndicator');
      this.renderer.removeClass(this.thirdIndicator.nativeElement, 'activeIndicator');
      this.firstSlideState = 'hidden';
      this.secondSlideState = 'shown';
      this.thirdSlideState = 'hidden';
    }
  }

  showThirdSlide(thirdIndicator) {
    if(!thirdIndicator.classList.contains('activeIndicator')) {
      this.renderer.addClass(thirdIndicator, 'activeIndicator');
      this.renderer.removeClass(this.secondIndicator.nativeElement, 'activeIndicator');
      this.renderer.removeClass(this.firstIndicator.nativeElement, 'activeIndicator');
      this.firstSlideState = 'hidden';
      this.secondSlideState = 'hidden';
      this.thirdSlideState = 'shown';
    }
  }

}
