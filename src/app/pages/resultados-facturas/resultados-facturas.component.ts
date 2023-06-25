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
    if (!this.sharing.sharingValue) {
      this.service.getFacturas(this.clienteName, (data) => {
        this.service.closeDialog();
        if (data.error === 'true') {
          this.service.presentToast(
            '¡Error! ',
            'No se ha podido procesar la solicitud',
            'error'
          );
          this.router.navigate(['/search']);
        } else {
          try {
            const resultados = JSON.parse(data.bodyData);
            if (resultados.respuesta == '1') {
              this.polizas = this.sharing.sharingValue = resultados.resultado;
            } else {
              this.service.presentToast(
                '¡Atención!',
                'El cliente no tiene pólizas pendientes de pago, si cree que es un error comuniquese con Seguros La Equidad',
                'warning'
              );
              this.router.navigate(['/search']);
            }
          } catch (e) {
            this.service.presentToast(
              '¡Error! ',
              'No se ha podido procesar la solicitud. ' + e,
              'error'
            );
            this.router.navigate(['/search']);
          }
        }
      });
    }
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

  descargar(detalle, idx) {
    console.log('consultando');
    this.service.getPDFBancos(
      { numeroId: this.clienteName, rowNum: idx + 1 },
      (data) => {
        try {
          this.service.closeDialog();
          this.service.writeContents(
            data,
            'formulario_pago' + new Date().toISOString() + '.pdf',
            'application/pdf'
          );
        } catch (e) {
          this.service.presentToast(
            '¡Error! ',
            'No se ha podido procesar la solicitud. ' + e,
            'error'
          );
        }
      }
    );
  }

  pagarCon(metodo, modal = null) {
    const reference = this.service.generateUUID();
    let polizasAPagar = [];
    for (let poliza of this.polizas) {
      for (let detalle of poliza.detalle) {
        if (detalle.permite && detalle.selected) {
          polizasAPagar.push(detalle);
        }
      }
    }

    const transaccion = {
      rID: reference,
      wID: '117653-1664468208-49142',
      jsonPolizas: JSON.stringify(polizasAPagar),
    };

    switch (metodo) {
      case 'wompi':
        console.log(
          'referencia: ' + reference,
          `${environment.host}/transaccion?check=wompi&rID=${reference}`
        );

        var checkout = new WidgetCheckout({
          currency: 'COP',
          amountInCents: this.sumarDeudaSeleccionada() * 100,
          reference: reference,
          publicKey: environment.wompiKey,
          redirectUrl: `${environment.host}/transaccion?check=wompi&rID=${reference}`,
        });

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

        const asyncCall2 = new Promise((resolve, reject) =>
          this.service.crearTransaccionWompi(transaccion, resolve, reject)
        );

        asyncCall2
          .then(() => {
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
          })
          .catch(() =>
            this.service.presentToast(
              '¡Atención!',
              'No podemos comunicarnos con la pasarela en estos momentos',
              'warning'
            )
          );

        break;

      case 'coomeva':
        this.service.presentAlertConfirm(
          '¿Está seguro?',
          'Esto abrirá una ventana externa con Bancoomeva donde deberá seguir el proceso. Recuerda: Sólo se financia una transacción',
          {
            confirmButtonText: 'Confirmar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            icon: 'warning',
          },
          (result) => {
            if (result.isConfirmed) {
              const transaccionCoomeva = {
                rID: reference,
                wID: '117653-1664468208-49142',
                jsonPolizas: JSON.stringify([modal]),
              };

              const asyncCall = new Promise((resolve, reject) =>
                this.service.crearTransaccionWompi(
                  transaccionCoomeva,
                  resolve,
                  reject
                )
              );

              asyncCall
                .then(() => {
                  const getIdTokenCallback = (idTokenObject: any) => {
                    if (
                      idTokenObject.statusCode >= 200 &&
                      idTokenObject.statusCode <= 300
                    ) {
                      const genUrlObject = {
                        monto: parseInt(modal.pago),
                        referencia1: modal.poliza,
                        referencia2: modal.certif,
                        referencia3: reference,
                      };

                      this.service.getGenURL(
                        idTokenObject.data.IdToken,
                        genUrlObject,
                        (generatedUrlObject) => {
                          if (
                            generatedUrlObject.statusCode >= 200 &&
                            generatedUrlObject.statusCode <= 300
                          ) {
                            this.service.IdTokenCoomeva =
                              idTokenObject.data.IdToken;

                            this.service.presentAlertConfirm(
                              '¡Atención!',
                              'Serás llevado a una página externa',
                              {
                                confirmButtonText: 'Confirmar',
                                icon: 'warning',
                              },
                              () => {
                                window.location.href =
                                  generatedUrlObject.data.url;
                              }
                            );
                          }
                        }
                      );
                    }
                  };

                  if (this.service.IdTokenCoomeva) {
                    getIdTokenCallback({
                      statusCode: 200,
                      data: { IdToken: this.service.IdTokenCoomeva },
                    });
                  } else {
                    this.service.getIdToken(getIdTokenCallback);
                  }
                })
                .catch(() =>
                  this.service.presentToast(
                    '¡Atención!',
                    'No podemos comunicarnos con la pasarela en estos momentos',
                    'warning'
                  )
                );
            }
          }
        );
        break;
    }
  }
}
