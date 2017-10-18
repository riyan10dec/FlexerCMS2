import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `
    <input type="checkbox" data-md-icheck  [(ngModel)]="renderValue" (change)="toggleVisibility(renderValue)"/>
  `,
})
export class CheckboxRenderComponent implements ViewCell, OnInit {

  renderValue;

  @Input() value: string | number;
  @Input() rowData: any;

  constructor() { }

  ngOnInit() {
    this.renderValue = this.value;
  }
  toggleVisibility(e) {
    this.renderValue = e ? false : true;
  }
  getMarked(): boolean {
      return this.renderValue;
  }
  setMarked(marked: boolean): void {
      this.renderValue = marked;
  }
}
