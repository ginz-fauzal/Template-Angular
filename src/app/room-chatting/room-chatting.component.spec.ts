import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomChattingComponent } from './room-chatting.component';

describe('RoomChattingComponent', () => {
  let component: RoomChattingComponent;
  let fixture: ComponentFixture<RoomChattingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomChattingComponent]
    });
    fixture = TestBed.createComponent(RoomChattingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
