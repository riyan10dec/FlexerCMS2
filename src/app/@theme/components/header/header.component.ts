import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { NotificationService } from '../notification/notification.service';
import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '../notification/notification.model';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  protected toggleNotification: boolean;
  @Input() position: string = 'normal';

  user: any;

  userMenu = [{ title: 'Log out', id: 'logout', link: '/pages/login'}];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private notificationService: NotificationService,
              private router: ActivatedRoute,
              ) {
                this.toggleNotification = false;
  }

    notifications: Notification[];
    notificationSub: Subscription;
  ngOnInit() {
    this.userService.getUser()
      .subscribe((user: any) => this.user = user);

    for (let i = 0; i < 10; i++) {
      let n = this.notificationService.createRandomNotification();
      this.notificationService.addNotification(n);
    }

    this.notificationService.startRandomGeneration();
    this.notificationSub = this.notificationService.notifications$.subscribe((notifications) => {
          this.notifications = notifications.sort((a, b) => b.date.valueOf() - a.date.valueOf()).slice(0, 10);
      });
  }
  onMenuItemClick(event): void {
    if (event.id === 'logout' ) {
        localStorage.removeItem('token');
        localStorage.removeItem('serverTime');
        localStorage.removeItem('clientID');
        localStorage.removeItem('userID');
        localStorage.removeItem('userName');
        
    }
  }
  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
