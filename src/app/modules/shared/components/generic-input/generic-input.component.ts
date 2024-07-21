import { AfterContentInit, ChangeDetectorRef, Component, DestroyRef, EventEmitter, forwardRef, inject, Injector, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, ValidationErrors } from '@angular/forms';
import { noop } from 'rxjs';

@Component({
  selector: 'app-generic-input',
  templateUrl: './generic-input.component.html',
  styleUrl: './generic-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenericInputComponent),
      multi: true,
    },
  ],
})
export class GenericInputComponent implements ControlValueAccessor, AfterContentInit {
  @Input() public label: string = '';
  @Input() public errorMessages: Map<String, String> = new Map();
  @Input() public required!: boolean;
  @Input() public disabled!: boolean;
  @Input() public placeholder: string = '';
  @Input() public type: 'text' | 'date' = 'text';
  @Output() change: EventEmitter<String> = new EventEmitter<String>();

  formControl: FormControl = new FormControl<string>('');
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private cdRef: ChangeDetectorRef, public injector: Injector) {
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl | null = this.injector.get(NgControl, { self: true, optional: true });
    if (ngControl) {
      setTimeout(() => {
        this.formControl = ngControl.control as FormControl;
        this.formControl.markAsUntouched();

      })
    }
  }

  ngAfterContentInit() {
    this.cdRef.detectChanges();
  }

  onChange: (value: string) => void = noop;
  onTouch: () => void = noop;

  registerOnChange(fn: (value: string) => void): void {
  }

  registerOnTouched(fn: () => void): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: string): void {
  }

  ngOnInit(): void {
  }

  public errorsToArray(errors: ValidationErrors | null): String[] {
    return errors ? Object.keys(errors) : [];
  }
}
