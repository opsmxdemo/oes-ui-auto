import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CreateDataSource } from 'src/app/models/applicationOnboarding/dataSourceModel/createDataSourceModel';
import * as fromFeature from '../../store/feature.reducer';
import * as DataSourceActions from '../../data-source/store/data-source.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-data-source',
  templateUrl: './create-data-source.component.html',
  styleUrls: ['./create-data-source.component.less']
})
export class CreateDataSourceComponent implements OnInit, OnChanges {

  @Output() closemodel = new EventEmitter<boolean>();
  @Input() accountData: any;
  @Input() accountBelongsTo: string;
  @Input() isEditMode: boolean;

  supportedDataSources = null;                                                         // It is use to store supported datasource information.
  imgPath = '../../../../assets/images/';                                              // It is use to store static path of image folder exist in assets.
  currentFormData = null;                                                              // It is use to store form data which is currently selected.
  providerBelongsTo = null;                                                            // It is use to store type of datasource belongs to i.e, AP or OES.
  selectedProviderObj: any = {
    datasourceType: '',
    name: '',
    configurationFields: {}
  };                                                                                   // It is use to hold selected Provider object data for post request.              
  selectedDataProvider: string;                                                        // It is use to store type of selected datasource provider.
  tableIsEmpty: boolean = false;                                                       // It use to hide table if no record exist in it.


  constructor(public store: Store<fromFeature.State>) { }

  ngOnChanges(changes: SimpleChanges){
    if(this.isEditMode){
      this.providerBelongsTo = this.accountBelongsTo;
      this.selectedDataProvider = this.accountData.datasourceType;
      this.selectedProviderObj = {
        datasourceType: this.accountData.datasourceType,
        id: this.accountData.id,
        name: '',
        configurationFields: {},
      };
      if(this.accountBelongsTo === 'AP'){
        this.supportedDataSources['autopilotDataSources'].forEach(datasourceObj => {
          if(datasourceObj.datasourceType === this.accountData.datasourceType){
            this.currentFormData = datasourceObj.configurationFields;
          }
        });
      }else{
        this.supportedDataSources['oesDataSources'].forEach(datasourceObj => {
          if(datasourceObj.datasourceType === this.accountData.datasourceType){
            this.currentFormData = datasourceObj.configurationFields;
          }
        });
      }
    }else{
      this.selectedDataProvider = '';
      this.currentFormData = null;
      this.providerBelongsTo = null;
    }
  }

  ngOnInit() {
    

    // fetching data from state
    this.store.select(fromFeature.selectDataSource).subscribe(
      (response) => {
        if (response.supportedDatasource !== null) {
          this.supportedDataSources = response.supportedDatasource;
        }
      }
    );
  }



  // Below function is execute when user select any datasource from list of datasource.
  getDataProvider(e, selectedProviderData, providerBelongsTo) {
    // resetting the value selectedProviderObj
    this.selectedProviderObj = {
      datasourceType: selectedProviderData.datasourceType,
      name: '',
      configurationFields: {}
    };
    this.providerBelongsTo = providerBelongsTo;
    this.selectedDataProvider = e;
    this.currentFormData = selectedProviderData.configurationFields;
    this.isEditMode = false;
  }

  // Below function is use to execute on create dataSource
  onSaveForm(event) {
    debugger
    let postData = { ...this.selectedProviderObj };
    postData['name']=event.form.value.name;
    postData['configurationFields'] = event.form.value.configFields;
    if (this.providerBelongsTo === 'AP') {
      if(this.isEditMode){
        this.store.dispatch(DataSourceActions.updateAPDatasources({ UpdatedDataSource: postData }));
      }else{
        this.store.dispatch(DataSourceActions.createAPDatasources({ CreatedDataSource: postData }));
      }
    } else {
      if(this.isEditMode){
        this.store.dispatch(DataSourceActions.updateOESDatasources({ UpdatedDataSource: postData }));
      }else{
        this.store.dispatch(DataSourceActions.createOESDatasources({ CreatedDataSource: postData }));
      }
    }

    this.store.select(fromFeature.selectDataSource).subscribe(
      (response) => {
        if (response.datasaved) {
          this.closemodel.emit(true);
          this.selectedDataProvider = '';
        }
      }
    )

  }

}
