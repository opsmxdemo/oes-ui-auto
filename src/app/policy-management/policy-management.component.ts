import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-policy-management',
  templateUrl: './policy-management.component.html',
  styleUrls: ['./policy-management.component.less']
})
export class PolicyManagementComponent implements OnInit {

  endpointForm: FormGroup;                               // For Endpoint Section
  policyForm: FormGroup;                                 // For Policy section
  fileContent: any;                                      // For file data
  endpointTypes = ['type1','type2','type3','type4']

  constructor() { }

  ngOnInit(){

    // defining reactive form approach for endpointForm
    this.endpointForm = new FormGroup({
      endpointType: new FormControl('',Validators.required),
      endpointUrl: new FormControl('',Validators.required)
    });

     // defining reactive form approach for policyForm
     this.policyForm = new FormGroup({
      name: new FormControl('',Validators.required),
      description: new FormControl('',Validators.required),
      policyDetails: new FormControl('')
    });

  }

  // Below function is use to load file content
  loadFileContent(){
    Swal.fire({
      title: 'Load file of .rego extention',
      input: 'file',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      preConfirm: (fileList) => {
        debugger
        let ext = fileList.name.split('.');
        if(ext[1]==='rego'){
          let file = fileList;
          let fileReader: FileReader = new FileReader();
          fileReader.onloadend = (x) => {
            this.fileContent = fileReader.result;
            console.log('reader',this.fileContent);
            this.policyForm.patchValue({
              policyDetails:this.fileContent
            })
            
          }
          fileReader.readAsText(file);
          console.log('filecontent',this.fileContent);
        }else{
          Swal.showValidationMessage(
            `Request failed: Selected file is not .rego extention`
          )
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: 'File loaded successfully!!',
        })
      }
    })
  }

}
