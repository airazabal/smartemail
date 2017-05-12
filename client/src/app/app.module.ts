import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';

import { DropdownModule } from 'ng2-bootstrap/dropdown';
import { ModalModule } from 'ng2-bootstrap/modal';

import { AuthModule, AuthGuard } from './auth';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

import { DashboardModule, DashboardComponent } from './dashboard';
import { ProductModule } from './product/product.module';

import { FromComponentService } from './shared/utils/from-component.service';
import { SettingsComponent } from './shared/settings/settings.component'

import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    DashboardComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    DashboardModule,
    ProductModule,
    CoreModule,
    DropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}, AuthGuard, FromComponentService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
