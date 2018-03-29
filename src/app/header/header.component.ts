import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  doit() {
    const { Builder, By, Key, until } = require('..');

    let driver = new Builder()
      .forBrowser('firefox')
      .build();

    driver.get('http://www.google.com/ncr')
      .then(_ =>
        driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN))
      .then(_ => driver.wait(until.titleIs('webdriver - Google Search'), 1000))
      .then(_ => driver.quit());
  }
}
