import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-button',
  template: `
    <button (click)="onClick('something')">Performance</button><a>tes</a>
   `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();


  @Output() create = new EventEmitter<any>();


  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();

  }
  onClick(event): boolean {
    console.log(event);
    return true;
  }
}
