import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.less'],
  animations: [
    trigger('forgotpasswordanimation', [
        state('in', style({
            opacity: 1,
            transform: 'translateX(0px)'
        })),
        transition('void => *', [
            style({
                opacity: 0,
                transform: 'translateY(350px)'
            }),
            animate(1000)
        ]),

    ]),
]
})
export class ForgotpasswordComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
