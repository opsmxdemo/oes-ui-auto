import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'opsmx-app-icons-common-component',
  templateUrl: './icons-common-component.component.html',
  styleUrls: ['./icons-common-component.component.less']
})
export class OpsMxIconsCommonComponentComponent implements OnInit {
  @Input() commonIconsParams: any = {}; 
  icon={
    selectedClass:'',
    color:''
  }
  constructor() { }
  

  ngOnInit(): void {
  }

  selectClass(){
    
    
    
    if(this.commonIconsParams.iconName=='hint')
    {
      this.icon.selectedClass = "fa fa-question-circle"
      this.getcolorStyle("#999")
    }
    else if(this.commonIconsParams.iconName=='circledTick'){
      this.icon.selectedClass = "far fa fa-check-circle"
      this.getcolorStyle("#28a745")
    }
    else if(this.commonIconsParams.iconName=='tick'){
      this.icon.selectedClass = "fa fa-check color-green"
      this.getcolorStyle("green")
    }
    else if(this.commonIconsParams.iconName=='edit'){
      this.icon.selectedClass = "fas fa-pencil-alt"
      this.getcolorStyle("#4797de")
    }
    else if(this.commonIconsParams.iconName=='delete'){
      this.icon.selectedClass = "far fa-trash-alt"
      this.getcolorStyle("red")
    }
    else if(this.commonIconsParams.iconName=='refresh'){
      this.icon.selectedClass = "refresh-icon fa"
      this.getcolorStyle("#0ea4fb")
    }
    else if(this.commonIconsParams.iconName=='search'){
      this.icon.selectedClass = "fa fa-search"
      this.getcolorStyle("#999")
    }
    else if(this.commonIconsParams.iconName=='add'){
      this.icon.selectedClass = "fas fa-plus"
      this.getcolorStyle("#4797de")
    }
    else if(this.commonIconsParams.iconName=='barChart'){
      this.icon.selectedClass = "fa fa-bar-chart"
      this.getcolorStyle("#0ea4fb")
    }
    else if(this.commonIconsParams.iconName=='clipBoard'){
      this.icon.selectedClass = "fa fa-clipboard"
      this.getcolorStyle("#354454")
    }
    else if(this.commonIconsParams.iconName=='minus'){
      this.icon.selectedClass = "fas fa-minus-circle"
      this.getcolorStyle("#dc3545")
    }
    else if(this.commonIconsParams.iconName=='spinner'){
      this.icon.selectedClass = "fas fa-spinner"
      this.getcolorStyle("#999")
    }
    else if(this.commonIconsParams.iconName=='unlock'){
      this.icon.selectedClass = "fas fa-unlock"
      this.getcolorStyle("#007bff")
    }
    else if(this.commonIconsParams.iconName=='deploymentverificationIcon'){
      this.icon.selectedClass = "deploymentverification icon ng-star-inserted"
      this.getcolorStyle("#999")
    }

     return this.icon
  }

  getcolorStyle(defaultColor){
    if(this.commonIconsParams.color=='' || this.commonIconsParams.color==null ||  this.commonIconsParams.color==undefined)
      {
        this.icon.color= defaultColor
      }
      else{
        this.icon.color= this.commonIconsParams.color
      }
  }

}
