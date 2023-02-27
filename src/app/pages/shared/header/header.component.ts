import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public searchField: string;

  constructor() {}

  ngOnInit(): void {}

  gotoSearch() {
    window.open(
      `https://www.laequidadseguros.coop/component/search/?searchword=${this.searchField}&searchphrase=all&Itemid=111`,
      '_about#blank'
    );
  }
}
