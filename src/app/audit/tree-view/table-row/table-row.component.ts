import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.less'],
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
export class TableRowComponent implements OnInit {

  @Input() dataSource: any;
  @Input() displayedColumns: string[];
  @Input() title: string;
  @Input() referenceId: string;
  @Input() iconKeyReference: string;

  expandedId: string = '';

  constructor() {}
  ngOnInit(){
    debugger
   console.log('datasource',this.displayedColumns)
  }

  toggleExpandableSymbol(id: string): void {
    this.expandedId = this.expandedId === id ? '' : id;
  }

}
