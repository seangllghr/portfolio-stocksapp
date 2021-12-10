import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Match } from '@portfolio-stocksapp/shared-data-model';

@Component({
  selector: 'webstocks-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent {
  @Input() result!: Match;
  @Output() addStock: EventEmitter<Match> = new EventEmitter<Match>()

  onClick(): void {
    this.addStock.emit(this.result);
  }
}
