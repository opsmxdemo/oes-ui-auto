import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as fromFeature from './../store/feature.reducer';
import { Store } from '@ngrx/store';
import * as DeploymentAction from './../store/deploymentverification.actions';

@Component({
  selector: 'app-reclassification-history',
  templateUrl: './reclassification-history.component.html',
  styleUrls: ['./reclassification-history.component.less']
})
export class ReclassificationHistoryComponent implements OnInit {

  reclassificationHistory: any =[];
  closeButtonParams : any;

  constructor(private dialogRef: MatDialogRef<ReclassificationHistoryComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData,public store: Store<fromFeature.State>) { }

  ngOnInit(): void {
    this.store.dispatch(DeploymentAction.fetchReclassificationHistoryData(this.data));

    this.store.select(fromFeature.selectDeploymentVerificationState).subscribe(
      (resData) => {
        if (resData.reclassificationHistoryResults != null && resData.isReclassificationDataLoaded) {
          this.store.dispatch(DeploymentAction.loadedReclassificationHistoryData());
          this.reclassificationHistory = resData.reclassificationHistoryResults;
        }
      }
    );

    this.initializeParams();
  }

  close(){
    this.dialogRef.close();
  }

  initializeParams() {
    this.closeButtonParams = {
      type: 'button',
      text: 'Close',
      color: '',
      disabled : false  
    }
  }


}


export interface DialogData {
  logTemplateName: any,
  canaryId: any,
  serviceId: any
}
