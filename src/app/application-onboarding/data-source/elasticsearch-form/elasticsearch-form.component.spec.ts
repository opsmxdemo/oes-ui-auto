import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElasticsearchFormComponent } from './elasticsearch-form.component';

describe('ElasticsearchFormComponent', () => {
  let component: ElasticsearchFormComponent;
  let fixture: ComponentFixture<ElasticsearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElasticsearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElasticsearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
