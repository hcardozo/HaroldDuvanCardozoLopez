import { ComponentRef, EnvironmentInjector, Injectable, TemplateRef, Type, ViewContainerRef } from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalOptions } from '../interfaces/modal-options.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public newModalComponent!: ComponentRef<ModalComponent>;
  public options!: ModalOptions | undefined;

  constructor(
    private injector: EnvironmentInjector
  ) { }

  open<C>(vcrOrComponent: ViewContainerRef | Type<C>, param2?: TemplateRef<Element> | ModalOptions, options?: ModalOptions) {
    if (vcrOrComponent instanceof ViewContainerRef) {
      this.openWithTemplate(vcrOrComponent, param2 as TemplateRef<Element>);
      this.options = options;
    }
  }

  private openWithTemplate(viewContainerRef: ViewContainerRef, content: TemplateRef<Element>) {
    viewContainerRef.clear();
    const innerContent = viewContainerRef.createEmbeddedView(content);

    this.newModalComponent = viewContainerRef.createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [innerContent.rootNodes],
    });
  }

  close() {
    this.newModalComponent.instance.close();
  }
}
