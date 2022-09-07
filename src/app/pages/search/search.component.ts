import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  title = 'tesoreriaEquidad';

  isSearching = false;

  searchInput: number;

  constructor() { }

  ngOnInit(): void {

  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;    
    if (charCode === 13) {
      console.log("search propagación")
    } else if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  buscar() {
    this.isSearching = true;
  }
  
  limpiar() {
    this.searchInput = null;
  }

}
