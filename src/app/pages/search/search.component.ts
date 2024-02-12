import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { SharingService } from '../../../services/sharing.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  title = 'tesoreriaEquidad';

  isSearching = false;

  searchInput: string = '';

  constructor(
    private router: Router,
    private service: ApiService,
    private sharing: SharingService
  ) {}

  ngOnInit(): void {}

  keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode === 13) {
      this.buscar();
    } else if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  buscar() {
    if (this.searchInput == '') return;
    this.isSearching = true;
    this.service.getFacturas(this.searchInput, (data) => {
      this.isSearching = false;
      this.service.closeDialog();
      if (data.error === 'true') {
        this.service.presentToast(
          '¡Error! ',
          'No se ha podido procesar la solicitud debido a un problema en el servidor',
          'error'
        );
      } else {
        try {
          const resultados = data.bodyData.map((dat) => {
            return {
              ...dat,
              permiteFinancia: dat.permiteFinancia === 'true',
              permitePago: dat.permitePago === 'true',
            };
          });

          if (resultados.length) {
            this.sharing.sharingValue = resultados;
            this.router.navigate(['/results'], {
              queryParams: { numeroId: this.searchInput },
            });
          } else {
            this.service.presentToast(
              '¡Atención!',
              'El cliente no tiene pólizas pendientes de pago, si cree que es un error comuniquese con Seguros La Equidad',
              'warning'
            );
          }
        } catch (e) {
          this.service.presentToast(
            '¡Error! ',
            'No se ha podido procesar la solicitud debido a un problema con los datos. ' +
              e,
            'error'
          );
        }
      }
    });
  }

  limpiar() {
    this.searchInput = null;
  }
}
