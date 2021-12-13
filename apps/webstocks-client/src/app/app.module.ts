import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faTimes,
  faAngleDown,
  faAngleUp,
  faMinus,
  faRedo,
  faSearch,
  faBackspace,
} from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppComponent } from './app.component';
import { AddStockComponent } from './components/add-stock/add-stock.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuButtonComponent } from './components/menu-button/menu-button.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { StocksItemComponent } from './components/stocks-item/stocks-item.component';
import { StockDetailComponent } from './components/stock-detail/stock-detail.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';

const routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'stock',
    children: [
      { path: ':Symbol', component: StockDetailComponent },
      { path: '', redirectTo: '/', pathMatch: 'full' },
    ],
  },
  {
    path: 'add',
    component: AddStockComponent,
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];

@NgModule({
  declarations: [
    AppComponent,
    AddStockComponent,
    MenuComponent,
    MenuButtonComponent,
    NotFoundComponent,
    StocksComponent,
    StocksItemComponent,
    StockDetailComponent,
    WelcomeComponent,
    SearchBarComponent,
    SearchResultComponent,
    StockChartComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
    NgxEchartsModule.forRoot({ echarts: () => import ('echarts') }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faPlus,
      faTimes,
      faMinus,
      faRedo,
      faAngleUp,
      faAngleDown,
      faSearch,
      faBackspace
    );
  }
}
