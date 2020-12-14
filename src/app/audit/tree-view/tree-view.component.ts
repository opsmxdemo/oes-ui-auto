import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

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

  constructor(public store: Store<fromApp.AppState>) { }



  treeViewData: any;
  displayedColumns = [];
  childData: any;
  dataAvaliable: boolean;
  loading: boolean = false;

  ngOnInit() {


    // fetching data from state
    this.store.select('audit').subscribe(
      (auditdata) => {
        if (auditdata.treeViewLoading) {
          this.loading = true;
          this.dataAvaliable = true;
        } else {
          this.loading = false;
          if (auditdata.treeViewData !== null) {
            debugger
            this.treeViewData = auditdata.treeViewData;
            if (this.treeViewData.results.length > 0 && this.treeViewData.results[0].child.length > 0) {
              var key = Object.keys(this.treeViewData.results[0].child[0]);
              key.forEach(ArrKeys => {
                if (ArrKeys !== 'child' && ArrKeys !== 'configId' && ArrKeys !== 'childOf') {
                  this.displayedColumns.push(ArrKeys);
                }
              })
              this.childData = this.treeViewData.results[0].child;
              this.dataAvaliable = true;
            } else {
              this.dataAvaliable = false;
            }

          }
        }

      }
    )
  }

}
