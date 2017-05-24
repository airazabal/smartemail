/*
# Copyright 2016 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
# limitations under the License.
*/
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DropdownModule } from 'ng2-bootstrap/dropdown';
import { ModalModule } from 'ng2-bootstrap/modal';

import { SmartEmailDetailsComponent } from './smart-email-details/smart-email-details.component';
import { SmartEmailTestComponent } from './smart-email-test/smart-email-test.component';
import { SmartEmailSummaryComponent} from './smart-email-summary/smart-email-summary.component';
import { SmartEmailClassificationsComponent} from './smart-email-classifications/smart-email-classifications.component';
import { SmartEmailEntitiesComponent} from './smart-email-entities/smart-email-entities.component';

import { WslEmailModule } from '../shared/wsl-email/wsl-email.module';

import { DashboardCtxService } from './shared/dashboard-ctx.service';
import { TransactionSummaryComponent } from './smart-email-classifications/transaction-summary/transaction-summary.component';
import { TransactionCountComponent } from './smart-email-classifications/transaction-count/transaction-count.component';

import { ConfusionMatrixComponent } from './shared/confusion-matrix/confusion-matrix.component'
import { ConfusionMatrixService } from './shared/confusion-matrix/confusion-matrix.service'
import { F1GraphComponent } from './shared/confusion-matrix/f1-graph.component'
import { TableOfConfusionComponent } from './shared/confusion-matrix/table-of-confusion.component'
import { EmailSummaryComponent } from './shared/email-summary/email-summary.component';
import { HelpComponent } from './shared/help/help.component';
import { MvpCalcComponent } from './shared/mvp-calc/mvp-calc.component';


@NgModule({
  imports:      [ CommonModule,
    FormsModule,
    RouterModule,
    WslEmailModule,
    DropdownModule.forRoot(),
    ModalModule.forRoot() ],
  declarations: [
    SmartEmailTestComponent,
    SmartEmailDetailsComponent,
    SmartEmailSummaryComponent,
    SmartEmailClassificationsComponent,
    SmartEmailEntitiesComponent,
    EmailSummaryComponent,
    TransactionSummaryComponent,
    TransactionCountComponent,
    F1GraphComponent,
    TableOfConfusionComponent,
    HelpComponent,
    ConfusionMatrixComponent,
    MvpCalcComponent
  ],
  providers: [
    ConfusionMatrixService,
    DashboardCtxService ]
})

export class DashboardModule {
  constructor() { }
}
