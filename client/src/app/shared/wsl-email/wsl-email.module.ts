import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdTableModule } from '@angular/material/table';
import { MdSortModule } from '@angular/material/sort';
import { MdPaginatorModule } from '@angular/material/paginator';
import { MdExpansionModule } from '@angular/material/expansion';
import { MdRadioModule } from '@angular/material/radio';
import { MdInputModule } from '@angular/material/input';
import { MdCardModule } from '@angular/material/card';

//import { DiscoveryQueryService } from './discovery-query.service'; -> might no longer be needed
import { BackendService} from '../../core/backend.service';
import { SmartEmailService } from './smart-email.service';
import { UtilService } from './util.service';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { EmailVizComponent } from './email-viz/email-viz.component';
import { EmailInputComponent } from './email-input/email-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MdTableModule,
    MdSortModule,
    MdPaginatorModule,
    MdExpansionModule,
    MdRadioModule,
    MdInputModule,
    MdCardModule,
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot()
  ],
  declarations: [EmailVizComponent, EmailInputComponent],
  exports:[EmailVizComponent, EmailInputComponent],
  providers: [UtilService, SmartEmailService, BackendService ]
})
export class WslEmailModule { }
