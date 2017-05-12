import { Component, ViewContainerRef  } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `
})

export class AppComponent {

  title = 'Hartford SmartEmail';

  public constructor(private titleService: Title) {
    this.titleService.setTitle( this.title );
  }

}
