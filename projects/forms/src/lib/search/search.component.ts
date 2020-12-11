import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'opsmx-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class OpsMxSearchComponent implements OnInit {
  @Input() searchBoxParams: any = {};
  @Output() filteredList = new EventEmitter();
  searchData:any;
  outputList:any;
  keysToFilter:any;

  constructor() { }

  ngOnInit(): void {
   
  }

  // for filtering 
  onSearch(){
    
    if(Array.isArray(this.searchBoxParams.optionsList)){
      let keys // stores the keys for filtering
      
      this.outputList =  this.searchBoxParams.optionsList.filter((option,i) => {
        if( this.searchBoxParams.keys==undefined || this.searchBoxParams.keys==null)
        {
          keys = Object.keys(option); // for getting keys
        }
        else{
          if(Array.isArray(this.searchBoxParams.keys))
          {
            if(this.searchBoxParams.keys.length > 0){
              keys = this.searchBoxParams.keys;
            }
            else{
              keys = Object.keys(option);
            }
          }
          else{
            console.error("OpsMxSearch accepts only Arrays for keys")
          }
          
        }
        console.log(option);
        return keys.find((key) => {
          const valueString = option[key].toString().toLowerCase();
          return valueString.includes(this.searchData.toLowerCase());
        })
        ? option
        : null;
      });
   // }
      this.filteredList.emit(this.outputList);
    }
    else{
      console.error("OpsMxSearch accepts only Arrays for optionsList")
    }
    
  }
// @author:Nitish Dhawan
}
