import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ModalOptions } from '../../interfaces/modal-options.interface';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @ViewChild('modal') public modal!: ElementRef<HTMLDivElement>;
  @ViewChild('overlay') public overlay!: ElementRef<HTMLDivElement>;
  options!: ModalOptions | undefined;

  constructor(
    private modalService: ModalService,
    private element: ElementRef
  ) { }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.modalService.close();
  }

  public onClose() {
    this.modalService.close();
  }

  ngAfterViewInit() {
    this.options = this.modalService.options;
    this.addOptions();
  }

  private addOptions() {
    this.modal.nativeElement.style.minWidth = this.options?.size?.minWidth || 'auto';
    this.modal.nativeElement.style.width = this.options?.size?.width || 'auto';
    this.modal.nativeElement.style.maxWidth = this.options?.size?.maxWidth || 'auto';
    this.modal.nativeElement.style.minHeight = this.options?.size?.minHeight || 'auto';
    this.modal.nativeElement.style.height = this.options?.size?.height || 'auto';
    this.modal.nativeElement.style.maxHeight = this.options?.size?.maxHeight || 'auto';
  }

  public close() {
    this.modalService.options = undefined;
    this.element.nativeElement.remove();
    return;
  }

}
