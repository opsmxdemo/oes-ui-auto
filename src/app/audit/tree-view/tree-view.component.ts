import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TestService } from 'src/app/services/test.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { TreeView } from 'src/app/models/audit/treeView.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.less'],
  animations: [ 
    trigger('expandableRow', [
      state('collapsed, void', style({
        height: '0px',
        visibility: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        visibility: 'visible'
      })),
      transition(
        'expanded <=> collapsed, void <=> *',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ])
  ]
})
export class TreeViewComponent implements OnInit {

  constructor(public userService:TestService,
              public store: Store<fromApp.AppState>) { }

 
  
  treeViewData: any;
  displayedColumns = [];
  childData: any;

  ngOnInit() {
   

      // fetching data from state
      this.store.select('audit').subscribe(
        (auditdata) => {
          
          if(auditdata.treeViewData !== null){

            this.treeViewData = auditdata.treeViewData;
            var key = Object.keys(this.treeViewData[0].child[0]);
            key.forEach(ArrKeys => {
              if( ArrKeys !== 'child'){
                this.displayedColumns.push(ArrKeys);
              }
            }) 
            this.childData = this.treeViewData[0].child;
          }
        }
      )
  }

}
