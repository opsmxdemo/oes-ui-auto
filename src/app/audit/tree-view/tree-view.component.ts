import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TestService } from 'src/app/services/test.service';

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

  constructor(public userService:TestService) { }

 
  users: any;

  displayedColumns: string[] = [
    'Identification number', 
    'Name', 
    'Gender',
    'Risk', 
    'Hair length', 
    'IQ', 
    'Admission date', 
    'Last breakdown', 
    'Yearly fee', 
    'Knows the Joker?',
    'deleteIcon'
  ];

  ngOnInit() {
    this.userService
      .getUsers()
      .subscribe(data => this.users = data);
  }

}
