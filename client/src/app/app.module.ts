import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdTabsModule } from '@angular/material/tabs';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AuthModule, AuthGuard } from './auth';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

import { DashboardModule, DashboardComponent } from './dashboard';

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
    FormsModule,
		ReactiveFormsModule,
    HttpModule,
    MdTabsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule,
    DashboardModule,
    CoreModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    NgbModule.forRoot()
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}, AuthGuard, FromComponentService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
