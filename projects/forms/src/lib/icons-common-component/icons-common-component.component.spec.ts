import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsCommonComponentComponent } from './icons-common-component.component';

describe('IconsCommonComponentComponent', () => {
  let component: IconsCommonComponentComponent;
  let fixture: ComponentFixture<IconsCommonComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconsCommonComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconsCommonComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
