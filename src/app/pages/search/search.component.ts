import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { SharingService } from '../../../services/sharing.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  title = 'tesoreriaEquidad';

  isSearching = false;

  searchInput: string = '';

  constructor(
    private readonly router: Router,
    private readonly service: ApiService,
    private readonly sharing: SharingService
  ) {}

  keyPressNumbers(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode === 13) {
      this.buscar();
    } else if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  buscar() {
    if (this.searchInput == '') return;
    this.isSearching = true;
    this.service.getFacturas(
      this.searchInput,
      (data: any) => {
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
            const resultados = data.bodyData.map((dat: any) => {
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
      },
      () => {
        this.isSearching = false;
      }
    );
  }

  limpiar() {
    this.searchInput = '';
  }
}
