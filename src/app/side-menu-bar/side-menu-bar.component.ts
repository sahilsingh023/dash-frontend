import { Router } from '@angular/router';
import { ViewChild, ElementRef, Component } from '@angular/core';


@Component({
  selector: 'app-side-menu-bar',
  templateUrl: './side-menu-bar.component.html',
  styleUrls: ['./side-menu-bar.component.scss']
})
export class SideMenuBarComponent {
  constructor(private router: Router) { }
  @ViewChild('menu')
  menu!: ElementRef;

  navigateTo(url: string) {
    // Get the href of the clicked element
    const href = this.menu.nativeElement.querySelector('a').getAttribute('href');

    // Navigate to the URL
    this.router.navigate([url + href]);
  }

}
