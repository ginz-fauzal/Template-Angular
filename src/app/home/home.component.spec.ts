import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServicesService } from '../services.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [ServicesService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize rooms array', () => {
    expect(component.rooms).toBeDefined();
    expect(component.rooms.length).toBe(0);
  });


  it('should toggle profileView when profileShow is called', () => {
    expect(component.profileView).toBeFalse();

    component.profileShow();
    expect(component.profileView).toBeTrue();

    component.profileShow();
    expect(component.profileView).toBeFalse();
  });

  // Add more test cases as needed

});