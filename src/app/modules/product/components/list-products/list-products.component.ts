import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ColumnType } from '../../../shared/enums/column-type.enum';
import { Icons } from '../../../shared/enums/icons.enum';
import { Column } from '../../../shared/interfaces/column.interface';
import { HttpApiResponse } from '../../../shared/interfaces/http-api-response.interface';
import { ModalService } from '../../../shared/services/modal.service';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { AlertType } from '../../../shared/enums/alert-enum';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent implements OnInit {



  @ViewChild('deleteProduct', { static: true, read: ViewContainerRef }) public vcr!: ViewContainerRef;

  public searchFormControl: FormControl = new FormControl();
  public rowsPerPageFormControl: FormControl = new FormControl('5');
  public columnType = ColumnType;
  public products: Product[] = [];
  public productToShow: Product[] = [];
  public productToDelete!: Product | null;
  public icons = Icons;
  public showOptionForIndex!: number | null;
  public columns: Column<Product>[] = [
    { label: 'Logo', value: 'logo', type: ColumnType.IMAGE, width: '150px', minWidth: '150px' },
    { label: 'Nombre del producto', value: 'name', type: ColumnType.TEXT, minWidth: '200px' },
    { label: 'Descripcion', value: 'description', tooltip: 'Esto es un tooltip', type: ColumnType.TEXT, minWidth: '300px' },
    { label: 'Fecha de liberacion', value: 'date_release', tooltip: 'Esto es un tooltip', type: ColumnType.TEXT, width: '300px', minWidth: '200px' },
    { label: 'Fecha de reestructuracion', value: 'date_revision', tooltip: 'Esto es un tooltip', type: ColumnType.TEXT, width: '300px', minWidth: '200px' },
  ];

  public constructor(
    private productService: ProductService,
    private router: Router,
    private modalService: ModalService,
    private alertService: AlertService) {
    this.rowsPerPageFormControl.valueChanges.subscribe((value: string) => {
      if (value) {
        this.productToShow = this.products.slice(0, +value);
        if (this.searchFormControl.value) {
          this.filterProductsByString(this.searchFormControl.value);
        }
      }
    });

    this.searchFormControl.valueChanges.subscribe((value: string) => this.filterProductsByString(value))
  }

  public ngOnInit(): void {
    this.getProductList();
  }

  public getProductList(): void {
    this.productService.get().subscribe((httpApiResponse: HttpApiResponse<Product[]>) => {
      this.products = httpApiResponse.data!
      this.productToShow = this.products.slice(0, +this.rowsPerPageFormControl.value);
    });
  }

  public redirect(route: string, data?: any): void {
    let navigationExtras: NavigationExtras = { state: { data } };
    this.router.navigate([route], navigationExtras);
  }

  public filterProductsByString(value: string): void {
    if (value) {
      let temporal = this.products.filter((product: Product) => product.name.includes(value) || product.description.includes(value) || product.date_release.includes(value) || product.date_revision.includes(value));
      this.productToShow = temporal.slice(0, this.rowsPerPageFormControl.value);
    } else {
      this.productToShow = this.products.slice(0, this.rowsPerPageFormControl.value);
    }
  }

  openModalTemplate(view: TemplateRef<Element>) {
    this.modalService.open(this.vcr, view, {
      size: {
        width: '25rem',
      },
    });
  }


  public closeModal(): void {
    this.productToDelete = null;
    this.modalService.close();
  }

  public showModalEditRow(product: Product, templateRef: TemplateRef<Element>): void {
    this.productToDelete = product;
    this.openModalTemplate(templateRef);
  }

  public confirmDeleteProduct(): void {
    this.productService.delete(this.productToDelete!.id).subscribe((response: any) => {
      this.showOptionForIndex = null;
      this.closeModal();
      this.getProductList();
      this.alertService.showAlert(AlertType.SUCCESS, 'Producto eliminado !');
    })
  }
}
