import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CreateDataSource } from 'src/app/models/applicationOnboarding/dataSourceModel/createDataSourceModel';
import * as fromFeature from '../../store/feature.reducer';
import * as DataSourceActions from '../../data-source/store/data-source.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-data-source',
  templateUrl: './create-data-source.component.html',
  styleUrls: ['./create-data-source.component.less']
})
export class CreateDataSourceComponent implements OnInit {

  @Output() closemodel = new EventEmitter<boolean>();

  supportedDataSources = null;                                                         // It is use to store supported datasource information.
  imgPath = '../../../../assets/images/';                                              // It is use to store static path of image folder exist in assets.
  currentFormData = null;                                                              // It is use to store form data which is currently selected.
  providerBelongsTo = null;                                                            // It is use to store type of datasource belongs to i.e, AP or OES.
  selectedProviderObj: CreateDataSource = {
    datasourceType: '',
    name: '',
    configurationFields: {}
  };                                                                                   // It is use to hold selected Provider object data for post request.              
  selectedDataProvider: string;                                                        // It is use to store type of selected datasource provider.
  tableIsEmpty: boolean = false;                                                       // It use to hide table if no record exist in it.


  constructor(public store: Store<fromFeature.State>) { }

  ngOnInit() {
    this.selectedDataProvider = '';

    // fetching data from state
    this.store.select(fromFeature.selectDataSource).subscribe(
      (response) => {
        if (response.supportedDatasource !== null) {
          this.supportedDataSources = response.supportedDatasource;
        }
      });
  }



  // Below function is execute when user select any datasource from list of datasource.
  getDataProvider(e, selectedProviderData, providerBelongsTo) {
    // resetting the value selectedProviderObj
    this.selectedProviderObj = {
      datasourceType: selectedProviderData.datasourceType,
      name: selectedProviderData.displayName,
      configurationFields: {}
    };
    this.providerBelongsTo = providerBelongsTo;
    this.selectedDataProvider = e;
    this.currentFormData = selectedProviderData.configurationFields;
  }

  // Below function is use to execute on create dataSource
  onSaveForm(event) {
    let postData = { ...this.selectedProviderObj };
    postData['configurationFields'] = event.form.value;
    if (this.providerBelongsTo === 'AP') {
      this.store.dispatch(DataSourceActions.postAPDatasources({ CreatedDataSource: postData }));
    } else {
      this.store.dispatch(DataSourceActions.postOESDatasources({ CreatedDataSource: postData }));
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
