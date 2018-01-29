import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Copyright <b><a href="http://google.com" target="_blank">FlexerApp</a></b> 2018</span>
  `,
})
// <div class="socials">
    //   <a href="https://github.com/akveo" target="_blank" class="ion ion-social-github"></a>
    //   <a href="https://www.facebook.com/akveo" target="_blank" class="ion ion-social-facebook"></a>
    //   <a href="https://twitter.com/akveo_inc" target="_blank" class="ion ion-social-twitter"></a>
    //   <a href="https://www.linkedin.com/company/akveo" target="_blank" class="ion ion-social-linkedin"></a>
    // </div>
export class FooterComponent {
}
