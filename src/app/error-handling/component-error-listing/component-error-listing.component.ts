import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-component-error-listing',
  templateUrl: './component-error-listing.component.html',
  styleUrls: ['./component-error-listing.component.less']
})
export class CompLevelErrorListingComponent implements OnInit {

  @Input() errorString: String;

  constructor() { }

  ngOnInit(): void {
  }

  // Below function is use to break long string of error message into smaller parts
  errorStringTransformation(errorMessage){
    let errorString = errorMessage.split(' ');
    let transformString = '';
    let counter = 1;
    errorString.forEach((element,index) => {
      if(index === 0){
        transformString += '<span>'+element+'&nbsp';
      }else if(counter*60 === index){
        transformString += '</span><br><span>'+element+'&nbsp';
        counter++;
      }else if(index === errorString.length-1){
        transformString += element+'</span>'
      }
      else{
        transformString += element+'&nbsp';
      }
    });
    return transformString;
  }

}
