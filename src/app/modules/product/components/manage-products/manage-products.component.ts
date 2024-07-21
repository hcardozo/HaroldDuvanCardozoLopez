import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AlertType } from '../../../shared/enums/alert-enum';
import { AlertService } from '../../../shared/services/alert.service';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss',
})
export class ManageProductsComponent implements OnInit {
  public errorList: Map<String, String> = new Map();
  public constructor(
    private productService: ProductService,
    private router: Router,
    private alertService: AlertService) {
    let routerState = this.router.getCurrentNavigation()?.extras?.state;
    if (routerState?.['data']) {
      this.configFormToEdit(routerState['data'] as Product);
    }
    this.fillErrorList();

    this.productForm?.get('releaseDate')?.valueChanges.subscribe((value: string) => {
      if (value) {
        let dateRevision = new Date(value + 'T00:00:00');
        dateRevision.setFullYear(dateRevision.getFullYear() + 1);
        this.productForm.get('revisionDate')?.setValue(dateRevision.toISOString().split('T')[0]);
      }
    });
  }

  ngOnInit(): void { }

  private fillErrorList() {
    this.errorList.set('required', 'Este campo es requerido!');
    this.errorList.set('idExist', 'ID no valido');
    this.errorList.set('minlength', 'Rango de caracteres invalido');
    this.errorList.set('maxlength', 'Rango de caracteres invalido');
  }

  public productForm: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)], this.productIdValidator()),
    name: new FormControl(null, [Validators.minLength(5), Validators.maxLength(100),]),
    description: new FormControl(null, [Validators.minLength(10), Validators.maxLength(200),]),
    logo: new FormControl(null, Validators.required),
    releaseDate: new FormControl(null, Validators.required),
    revisionDate: new FormControl({ disabled: true, value: null }, Validators.required),
  });

  public onSave(): void {
    let body: Product = {
      id: this.productForm?.get('id')?.value!,
      name: this.productForm.value.name!,
      description: this.productForm.value.description!,
      logo: this.productForm.value.logo!,
      date_release: this.productForm.value.releaseDate,
      date_revision: this.productForm?.get('revisionDate')?.value
    };
    if (this.productForm?.get('id')?.disabled) {
      this.productService.update(body.id, body).subscribe((response: any) => {
        this.alertService.showAlert(AlertType.SUCCESS, 'Producto actualizado !');
        this.router.navigate(['./products/list']);
      });
    } else {
      this.productService.create(body).subscribe((response: any) => {
        this.alertService.showAlert(AlertType.SUCCESS, 'Producto creado !');
        this.router.navigate(['./products/list']);
      });
    }
  }

  public onReset(): void {
    this.productForm.reset();
    this.productForm.get('id')?.enable();
    this.productForm.updateValueAndValidity();
  }

  private productIdValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.productService
        .validate(control.value)
        .pipe(map((response: boolean) => (response ? { idExist: true } : null)));
    };
  }

  public getFormControl(key: string): FormControl {
    return this.productForm.get(key) as FormControl;
  }

  public configFormToEdit(product: Product): void {
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      releaseDate: product.date_release,
      revisionDate: product.date_revision,
    });
    this.productForm.get('id')?.disable();
  }
}
