import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConnectorTemplateConfigService } from '../connector-template-config.service';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'app-connector-template-row',
  templateUrl: './connector-template-row.component.html',
  styleUrls: ['./connector-template-row.component.less']
})
export class ConnectorTemplateRowComponent implements OnInit, OnChanges {

  @Input() index: any;
  @ViewChild(JsonEditorComponent, { static: false }) tooltypeTemplateEditorJson: JsonEditorComponent;
  @Output() edited = new EventEmitter(); @ViewChild('tooltypeTemplateModel') tooltypeTemplateModel: ElementRef;
  @ViewChild('newtemplate') newtemplate: ElementRef;
  @ViewChild('edittemplate') edittemplate: ElementRef;

  toolTypes: any = [];
  connectorForm: FormGroup = new FormGroup({
    connectorType: new FormControl('', Validators.required),
    accountName: new FormControl('', Validators.required),
    templateId: new FormControl(''),
    templateName: new FormControl('', Validators.required),
    visibilityToolConnectorId: new FormControl('')
  });
  data: any;
  accountsForTooltypes: any = [];
  templatesForToolType: any = [];
  editMode: boolean;
  templateId: any;
  selectedTTTemplateTab;
  public tooltypeTemplateEditor: JsonEditorOptions;
  public tooltypeTemplateData: any = null;

  toolTemplateForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    toolType: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    template: new FormControl('')
  });
  
  templateDataForToolType: any;
  templateEditMode: boolean;
  editTemplateTriggered: boolean;
  showPopup: boolean;

  constructor(public service: ConnectorTemplateConfigService, private cd: ChangeDetectorRef) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.data = this.service.connectorData[this.index];
  }

  ngOnInit(): void {
    // Get the remaining connectors list
    if (this.data.status == 'edit') {
      this.setRowValues();
    } else {
      this.toolTypes = this.service.getRemainingConnectors();
      // this.data.editMode = true;
    }
    this.service.$connecterData.subscribe((data: any) => {
      if (this.service.connectorData.length > 0 && !this.service.connectorData[this.index].editMode) {
        this.disableEditMode();
      }
    });
    this.cd.detectChanges();
    this.tooltypeTemplateEditor = new JsonEditorOptions()
    this.tooltypeTemplateEditor.mode = 'code';
    this.tooltypeTemplateEditor.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.templateForm();
  }

  setRowValues() {
    this.connectorForm.setValue({
      accountName: this.data.visibilityToolConnectorId,
      connectorType: this.data.connectorType,
      templateId: this.data.templateId,
      templateName: this.data.templateId,
      visibilityToolConnectorId: this.data.visibilityToolConnectorId
    })
    this.disableEditMode();
    this.edited.emit([this.index, false]);
    this.onChangeTooltype(this.data.connectorType);
  }

  templateForm() {
    this.toolTemplateForm = new FormGroup({
      id: new FormControl(''),
      toolType: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      template: new FormControl('')
    });
  }

  disableEditMode() {
    // this.data.editMode = false;
    this.connectorForm.get('accountName').disable();
    this.connectorForm.get('templateName').disable();
    $("[data-toggle='tooltip']").tooltip('hide');
  }

  enableEditMode() {
    // this.data.editMode = true;
    this.connectorForm.get('accountName').enable();
    this.connectorForm.get('templateName').enable();
    $("[data-toggle='tooltip']").tooltip('hide');
  }

  onChangeTooltype(value: any) {
    // Load Accounts and Template based on selected Connector Type
    this.service.getAccountsForToolTypes(value).subscribe((resp: any) => {
      this.accountsForTooltypes = resp;
      if (this.data.status == 'edit') {
        // this.connectorForm.get('accountName').setValue(this.data.accountName);
      }
    });
    this.service.getTemplatesForToolTypes(value).subscribe((resp: any) => {
      this.templatesForToolType = resp;
      if (this.data.status == 'edit') {
        // this.connectorForm.get('accountName').setValue(this.data.templateName);
      }
    });
  }

  editConnector() {
    this.enableEditMode();
    this.edited.emit([this.index, true]);
  }

  saveConnector() {
    // Save the selected Connector Type config
    // set the newly added row to edit mode
    if (this.connectorForm.invalid) {
      this.connectorForm.controls.connectorType.markAsUntouched();
      this.connectorForm.controls.connectorType.markAsTouched();
      this.connectorForm.controls.accountName.markAsUntouched();
      this.connectorForm.controls.accountName.markAsTouched();
      this.connectorForm.controls.templateName.markAsUntouched();
      this.connectorForm.controls.templateName.markAsTouched();
      return;
    }
    this.data.status = 'edit'
    this.service.saveConnector(this.connectorForm.value).subscribe((resp: any) => {
      this.disableEditMode();
      this.data.connectorType = this.connectorForm.controls.connectorType.value;
      this.edited.emit([this.index, false]);
    });
  }

  removeConnector() {
    // Delete the connector type configuration
    // Call api to delete the connector type
    // Emit an event to let parent know a record is deleted
    if (this.data.visibilityToolConnectorId) {
      this.service.deleteConnector(this.data.visibilityToolConnectorId).subscribe((resp: any) => {
        this.service.connectorData.splice(this.index, 1);
        this.service.getRemainingConnectors();
      });
    } else {
      this.service.connectorData.splice(this.index, 1);
      this.service.getRemainingConnectors();
    }
  }

  onChangeAccountofTooltype(value: any) {

  }

  onChangeTemplateofTooltype(template: any) {
    if (template == '+') {
      this.templateId = '';
      this.connectorForm.controls.templateName.setValue('');

      let toolType = this.connectorForm.get('connectorType').value;
      this.toolTemplateForm.setValue({
        id: null,
        toolType: toolType,
        name: '',
        template: ''
      });

      this.toolTemplateForm.controls.id.disable();
      this.selectedTTTemplateTab = 'tooltype-template-form';
      setTimeout(() => {
        this.showPopup = true;
      }, 50);
      setTimeout(() => {
        this.newtemplate.nativeElement.click();
      }, 100);

      return;
    } else {
      this.templateId = template;
    }
  }

  editTemplate() {
    if (this.templateId) {
      this.templateEditMode = true;
      this.getTemplateDetails();
      this.editTemplateTriggered = true;
      this.editTemplateTriggered = this.templateId;
    }
  }

  loadEditTemplate(response) {
    // this.store.dispatch(ApplicationActions.isLoadedTemplateData());
    this.selectedTTTemplateTab = 'tooltype-template-form';
    this.templateDataForToolType = response;
    this.tooltypeTemplateData = response;
    // console.log(this.templateDataForToolType);
    if (this.editTemplateTriggered) {
      this.toolTemplateForm.controls.id.enable();
      this.toolTemplateForm.patchValue({
        id: this.templateDataForToolType.id,
        toolType: this.templateDataForToolType.toolType,
        name: this.templateDataForToolType.name,
        template: this.templateDataForToolType.template
      });
      this.editTemplateTriggered = false;
      setTimeout(() => {
        this.showPopup = true;
      }, 50);
      setTimeout(() => {
        this.edittemplate.nativeElement.click();
        this.cd.detectChanges();
      }, 100);
    }
  }

  getTemplateDetails() {
    this.service.getTemplateDetails(this.templateId).subscribe((resp: any) => {
      this.loadEditTemplate(resp);
    });
  }

  saveToolTypeTemplateForm() {
    if (this.toolTemplateForm.valid) {
      this.tooltypeTemplateData = this.toolTemplateForm.value;
      this.saveTooltypeTemplate();
    }
  }

  saveTooltypeTemplate() {
    // console.log(this.tooltypeTemplateData);

    let toolType = this.connectorForm.get('connectorType').value;
    if (this.tooltypeTemplateData.id) {
      this.service.updateTemplate(this.toolTemplateForm.value).subscribe((resp: any) => {
        this.service.getTemplatesForToolTypes(toolType).subscribe((resp: any) => {
          this.templatesForToolType = resp;
          if (this.data.status == 'edit') {
            // this.connectorForm.get('accountName').setValue(this.data.templateName);
          }
        });
      });
    }
    else {
      this.service.saveTemplate(this.toolTemplateForm.value).subscribe((resp: any) => {
        this.service.getTemplatesForToolTypes(toolType).subscribe((resp: any) => {
          this.templatesForToolType = resp;
          if (this.data.status == 'edit') {
            // this.connectorForm.get('accountName').setValue(this.data.templateName);
          }
        });
      });
    }

    if (this.tooltypeTemplateModel !== undefined) {
      this.tooltypeTemplateModel.nativeElement.click();
    }
  }

  closeTemplatePopup() {
    this.templateEditMode = false;
    this.showPopup = false;
  }

  onClickTemplateTab(event) {
    if (event === 'tooltype-template-form-tab') {
      this.selectedTTTemplateTab = 'tooltype-template-form';
    } else if (event === 'tooltype-template-editor-tab') {
      this.selectedTTTemplateTab = 'tooltype-template-editor';
    }
  }
  
  getJsonFromTooltypeTemplateEditor(event = null) {
    this.tooltypeTemplateData = this.tooltypeTemplateEditorJson.get();
  }

}
