import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDataSourceComponent } from './create-data-source.component';

describe('CreateDataSourceComponent', () => {
  let component: CreateDataSourceComponent;
  let fixture: ComponentFixture<CreateDataSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDataSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
