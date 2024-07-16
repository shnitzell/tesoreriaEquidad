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
  public clienteName: string = '';
  public polizas: any = [];
  public rIdReference: string = '';
  public kAseguradoraPago: string = '';

  public kushkiApiRoute: string = environment.api;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private service: ApiService,
    private sharing: SharingService
  ) {
    config.keyboard = false;
    config.size = 'lg';
    config.windowClass = 'transparent-modal';
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
            const resultados = data.bodyData.map((dat: any) => {
              return {
                ...dat,
                permiteFinancia: dat.permiteFinancia === 'true',
                permitePago: dat.permitePago === 'true',
              };
            });

            if (resultados.length) {
              this.polizas = this.sharing.sharingValue = resultados;
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
    this.polizas.map((data: any) => {
      if (data.permitePago) {
        data.selected = !data.selected;
      }
      return data;
    });
  }

  canSelect(detalle: any) {
    const poliza = this.polizas.filter((poliza: any) => poliza.selected);
    if (!poliza.length) return true;
    return detalle.codigoCompania === poliza[0].codigoCompania;
  }

  totalChanged() {
    //Info
  }

  sumarDeuda() {
    let deuda: number = 0;

    for (let detalle of this.polizas) {
      deuda += parseInt(detalle.totalPagar);
    }

    return deuda;
  }

  sumarDeudaSeleccionada() {
    let deuda: number = 0;

    for (let detalle of this.polizas) {
      if (detalle.permitePago && detalle.selected) {
        deuda += parseInt(detalle.totalPagar);
      }
    }

    return deuda;
  }

  descargar(detalle: any, idx: number) {
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

  financiaCon(detalle: any) {
    if (detalle.permiteFinancia) {
      const alert = {
        title: '<strong>Selecciona la financiera de tu preferencia</strong>',
        iconHtml: ' <img src="assets/images/financiar.png" width="60" />',
        html: '',
        showConfirmButton: true,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonColor: 'transparent',
        confirmButtonText:
          '<img src="assets/images/bancoomeva-logo.png" height="40" />',
        confirmButtonAriaLabel: 'Bancoomeva',
        customClass: {
          icon: 'iconBox',
        },
      };

      const entidadesCallback = (result: any) => {
        if (result.isConfirmed) this.pagarCon('coomeva', detalle);
      };

      this.service.presentAlertConfirm('', '', alert, entidadesCallback);
    }
  }

  pagarCon(metodo: string, modal: any = null) {
    let polizasAPagar = [];
    for (let detalle of this.polizas) {
      if (detalle.permitePago && detalle.selected) {
        polizasAPagar.push(detalle);
      }
    }

    const referenceFirstDocument = polizasAPagar[0] ?? modal;
    const reference = `${referenceFirstDocument.codigoAgencia}-${referenceFirstDocument.asegurado}-${referenceFirstDocument.codigoPoliza}-${referenceFirstDocument.certificadoPoliza}`;
    const keyPago: keyof typeof environment.aseguradora =
      referenceFirstDocument.compania.toString().toLowerCase();

    const transaccion = {
      rID: reference,
      wID: '117653-1664468208-49142',
      jsonPolizas: JSON.stringify(polizasAPagar),
      medio: '',
    };

    switch (metodo) {
      case 'wompi':
        {
          console.log(
            'referencia: ' + reference,
            `${environment.host}/transaccion?check=wompi&rID=${reference}`
          );

          transaccion['medio'] = 'wompi';

          const cadenaConcatenada = `${reference}${
            this.sumarDeudaSeleccionada() * 100
          }COP${environment.aseguradora[keyPago].wompi.integrity}`;

          this.service.wompiIntegrity(cadenaConcatenada).then((integrity) => {
            const checkout = new WidgetCheckout({
              currency: 'COP',
              amountInCents: this.sumarDeudaSeleccionada() * 100,
              reference: reference,
              publicKey: environment.aseguradora[keyPago].wompi.key,
              signature: {
                integrity,
              },
              redirectUrl: `${environment.host}/transaccion?check=wompi&rID=${reference}`,
            });

            const asyncCall = new Promise((resolve, reject) =>
              this.service.crearTransaccionWompi(transaccion, resolve, reject)
            );

            asyncCall
              .then((response: any) => {
                if (response.success) {
                  checkout.open(function (result: any) {
                    const transaction = result.transaction;
                    console.log('Transaction ID: ', transaction.id);
                    console.log('Transaction object: ', transaction);
                  });
                } else {
                  this.service.presentToast(
                    '¡Atención!',
                    'No podemos comunicarnos con la pasarela en estos momentos',
                    'warning'
                  );
                }
              })
              .catch(() =>
                this.service.presentToast(
                  '¡Atención!',
                  'No podemos comunicarnos con la pasarela en estos momentos',
                  'warning'
                )
              );
          });
        }
        break;
      case 'kushki':
        {
          // kushki.js.merchantId=1000000530206406278515561278883
          // kushki.aplicaRecaudo.aplica=http://192.168.243.32:8080/aplicarRecaudo

          this.modalService.open(modal);

          transaccion['medio'] = 'kushki';

          const asyncCall2 = new Promise((resolve, reject) =>
            this.service.crearTransaccionWompi(transaccion, resolve, reject)
          );

          asyncCall2
            .then(() => {
              this.rIdReference = reference;
              this.kAseguradoraPago = keyPago;
              const kushki = new KushkiCheckout({
                kformId: environment.aseguradora[keyPago].kushki.kFormId,
                form: 'kushki-pay-form',
                publicMerchantId:
                  environment.aseguradora[keyPago].kushki.publicMerchantId,
                amount: {
                  subtotalIva: 0, // Set it to 0 in case the transaction has no taxes
                  iva: 0, // Set it to 0 in case the transaction has no taxes
                  subtotalIva0: this.sumarDeudaSeleccionada(), // Set the total amount of the transaction here in case the it has no taxes. Otherwise, set it to 0
                },
                currency: 'COP',
                inTestEnvironment: true,
              });
            })
            .catch(() =>
              this.service.presentToast(
                '¡Atención!',
                'No podemos comunicarnos con la pasarela en estos momentos',
                'warning'
              )
            );
        }
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
                        monto: parseInt(modal.totalPagar),
                        referencia1: modal.codigoAgencia,
                        referencia2: modal.codigoPoliza,
                        referencia3: modal.certificadoPoliza,
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
