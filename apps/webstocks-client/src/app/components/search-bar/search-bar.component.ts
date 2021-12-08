import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'webstocks-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() placeholder = '';
  text = '';
  @Output() textChange = new EventEmitter<string>();

  clearSearch(): void {
    this.text = '';
    this.textChange.emit('');
  }

  onModelChange(): void {
    this.textChange.emit(this.text);
  }
}
