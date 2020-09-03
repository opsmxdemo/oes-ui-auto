import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as fromFeature from '../../store/feature.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-data-source-forms',
  templateUrl: './data-source-forms.component.html',
  styleUrls: ['./data-source-forms.component.less']
})
export class DataSourceFormsComponent implements OnInit, OnChanges {

  @ViewChild('datasourceForm') dynamicForm: NgForm;
  @Input() formData: any[];
  @Output() saveFormEvent = new EventEmitter<NgForm>();

  notSelectedList: boolean;                                        // It is use to display warning while no provider is selected from list.
  fromDataEmpty: boolean;                                          // It is use to display message when form dosen't contain any form field in it.
  loading: boolean = false;

  constructor(public store: Store<fromFeature.State>) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.formData === null){
      this.notSelectedList = true;
    }else{
      this.notSelectedList = false;
      if(this.formData.length > 0){
        this.fromDataEmpty = false;
        if(this.dynamicForm){
          this.dynamicForm.resetForm();
        }
      }else{
        this.fromDataEmpty = true;
      }
    }
  }

  ngOnInit(){
    this.store.select(fromFeature.selectDataSource).subscribe(
      (stateData) => {
        this.loading = stateData.loadingDatasource;
      }
    )
  }

  // Below function is execute after submit the form
  onSubmit(){
    if(this.dynamicForm.valid){
      let formData = this.dynamicForm;
      if(this.dynamicForm.value.clouddriver !== undefined){
        formData.form.value['clouddriver'] = this.dynamicForm.value.clouddriver === ""?false:true;
      }
      this.saveFormEvent.emit(formData);
    }
  }

}
