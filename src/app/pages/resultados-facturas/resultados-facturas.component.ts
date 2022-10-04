import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../environments/environment';

import { ApiService } from '../../../services/api.service';
import { SharingService } from '../../../services/sharing.service';

declare var WidgetCheckout: any;
declare var KushkiCheckout: any;

@Component({
  selector: 'app-resultados-facturas',
  templateUrl: './resultados-facturas.component.html',
  styleUrls: ['./resultados-facturas.component.scss'],
})
export class ResultadosFacturasComponent implements OnInit {
  private sessionId;

  public clienteName: string = '';
  public polizas: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private service: ApiService,
    private sharing: SharingService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'lg';
    this.route.queryParams.subscribe(
      (params) => (this.clienteName = params['numeroId'])
    );
  }

  ngOnInit(): void {
    if (!this.sharing.sharingValue) this.router.navigate(['/search']);
    this.polizas = this.sharing.sharingValue || [];
  }

  selectall() {
    this.polizas.map(
      (poliza) =>
        (poliza.detalle = poliza.detalle.map((data) => {
          if (data.permite) {
            data.selected = !data.selected;
          }
          return data;
        }))
    );
  }

  totalChanged() {}

  sumarDeuda() {
    let deuda: number = 0;

    for (let poliza of this.polizas) {
      for (let detalle of poliza.detalle) {
        deuda += parseInt(detalle.pago);
      }
    }

    return deuda;
  }

  sumarDeudaSeleccionada() {
    let deuda: number = 0;

    for (let poliza of this.polizas) {
      for (let detalle of poliza.detalle) {
        if (detalle.permite && detalle.selected) {
          deuda += parseInt(detalle.pago);
        }
      }
    }

    return deuda;
  }

  pagarCon(metodo, modal = null) {
    const reference = this.service.generateUUID();
    switch (metodo) {
      case 'wompi':
        console.log(
          'referencia: ' + reference,
          `${environment.host}/transaccion?check=wompi&rID=${reference}`
        );

        let polizasAPagar = [];
        for (let poliza of this.polizas) {
          for (let detalle of poliza.detalle) {
            if (detalle.permite && detalle.selected) {
              polizasAPagar.push(detalle);
            }
          }
        }

        var checkout = new WidgetCheckout({
          currency: 'COP',
          amountInCents: this.sumarDeudaSeleccionada() * 100,
          reference: reference,
          publicKey: environment.wompiKey,
          redirectUrl: `${environment.host}/transaccion?check=wompi&rID=${reference}`,
        });

        const transaccion = {
          rID: 'a066d177-d4cd-4414-8acc-1742c7f72ce0',
          wID: '117653-1664468208-49142',
          jsonPolizas: JSON.stringify(polizasAPagar),
        };

        const asyncCall = new Promise((resolve, reject) =>
          this.service.crearTransaccionWompi(transaccion, resolve, reject)
        );

        asyncCall
          .then(() => {
            checkout.open(function (result) {
              var transaction = result.transaction;
              console.log('Transaction ID: ', transaction.id);
              console.log('Transaction object: ', transaction);
            });
          })
          .catch(() =>
            this.service.presentToast(
              '¡Atención!',
              'No podemos comunicarnos con la pasarela en estos momentos',
              'warning'
            )
          );

        break;
      case 'kushki':
        // kushki.js.merchantId=1000000530206406278515561278883
        // kushki.aplicaRecaudo.aplica=http://192.168.243.32:8080/aplicarRecaudo

        this.modalService.open(modal);

        var kushki = new KushkiCheckout({
          form: 'kushki-pay-form',
          merchant_id: '1000000530206406278515561278883',
          amount: {
            subtotalIva: 0, // Set it to 0 in case the transaction has no taxes
            iva: 0, // Set it to 0 in case the transaction has no taxes
            subtotalIva0: this.sumarDeudaSeleccionada(), // Set the total amount of the transaction here in case the it has no taxes. Otherwise, set it to 0
            ice: 0, // Set it to 0 in case the transaction has no ICE (Impuesto a consumos especiales)
          },
          currency: 'COP',
          payment_methods: ['transfer'],
          inTestEnvironment: true,
          callback_url: `${environment.host}/transaccion?check=kushki&rID=${reference}`,
        });

        break;
      case 'bancoomeva':
        this.service.presentToast(
          '¡Atención!',
          'No podemos comunicarnos con la pasarela en estos momentos',
          'warning'
        );
        break;
    }
  }
}
