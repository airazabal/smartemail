import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendService } from './backend.service';
import { LoggerService } from './logger.service';
import { SettingsService} from './settings.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [BackendService, LoggerService, SettingsService]
})
export class CoreModule { }
