import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { DiscoveryQueryService } from './discovery-query.service'; -> might no longer be needed
import { BackendService} from '../../core/backend.service';
import { SmartEmailService } from './smart-email.service';
import { UtilService } from './util.service';

import { CollapseModule } from 'ng2-bootstrap/collapse';

import { EmailVizComponent } from './email-viz/email-viz.component';
import { EmailInputComponent } from './email-input/email-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CollapseModule.forRoot()
  ],
  declarations: [EmailVizComponent, EmailInputComponent],
  exports:[EmailVizComponent, EmailInputComponent],
  providers: [UtilService, SmartEmailService, BackendService ]
})
export class WslEmailModule { }
