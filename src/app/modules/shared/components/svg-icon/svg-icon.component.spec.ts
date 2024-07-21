import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SvgIconComponent } from './svg-icon.component';
import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';

// Crear un mock de DomSanitizer
class MockDomSanitizer {
  bypassSecurityTrustHtml(value: string): SafeHtml {
    return value as SafeHtml; // Simular la función bypassSecurityTrustHtml
  }
}

describe('SvgIconComponent', () => {
  let component: SvgIconComponent;
  let fixture: ComponentFixture<SvgIconComponent>;
  let httpTestingController: HttpTestingController;
  let sanitizer: MockDomSanitizer;
  let httpClient: HttpClient;

  beforeEach(() => {
    sanitizer = new MockDomSanitizer();

    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [SvgIconComponent],
      providers: [
        { provide: DomSanitizer, useValue: sanitizer },
        provideHttpClient(),
        provideHttpClientTesting(),

      ]
    });

    fixture = TestBed.createComponent(SvgIconComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe actualizar el svgIcon cuando el input name cambia', () => {
    const mockSvg = '<svg></svg>';
    const safeHtml: SafeHtml = mockSvg as SafeHtml;
    jest.spyOn(sanitizer, 'bypassSecurityTrustHtml').mockReturnValue(safeHtml);

    component.name = 'test-icon';
    fixture.detectChanges();

    let req;
    fixture.whenStable().then(() => {
      req = httpTestingController.expectOne('svg/test-icon.svg');
      expect(req.request.method).toBe('GET');
      req.flush(mockSvg);

      fixture.detectChanges();

      expect(component.svgIcon).toBe(safeHtml);
      const spanElement: HTMLElement = fixture.nativeElement.querySelector('span.svg-icon')!;
      expect(spanElement.innerHTML).toBe(mockSvg);
    });

  });

  it('debe limpiar svgIcon cuando el input name es indefinido', () => {
    component.name = undefined;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.svgIcon).toBe('');
    });
  });

  it('no debe realizar el consumo del SVG si el name esta vacio', () => {
    // Test when name is undefined
    component.name = undefined;
    const spy = jest.spyOn(httpClient, 'get').mockImplementation(() => {
      throw new Error('HttpClient should not be called');
    });
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();

    // Test when name is empty
    component.name = '';
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  });
});
