import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSourceFormsComponent } from './data-source-forms.component';

describe('DataSourceFormsComponent', () => {
  let component: DataSourceFormsComponent;
  let fixture: ComponentFixture<DataSourceFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSourceFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSourceFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
