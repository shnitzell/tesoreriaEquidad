import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public IdTokenCoomeva = '';
  private api = environment.api;
  private headers = new HttpHeaders();
  private accesstype: any = [];
  msgSended = false;

  constructor(private httpClient: HttpClient) {
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('No-Auth', 'True');
  }

  writeContents(content: any, fileName: string, contentType: string) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  async wompiIntegrity(cadenaConcatenada: string) {
    const encondedText = new TextEncoder().encode(cadenaConcatenada);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }

  generateUUID() {
    let d = new Date().getTime();
    let d2 =
      (typeof performance !== 'undefined' &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = Math.random() * 16;
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  async presentAlertConfirm(
    title: string,
    mensaje: string,
    additionalOpt: any = null,
    callback: (value: any) => void
  ) {
    let options = {
      title: title,
      text: mensaje,
      ...additionalOpt,
    };

    Swal.fire(options).then(callback);
  }

  async presentToast(title: string, mensaje: string, type = 'success') {
    switch (type) {
      case 'success':
        Swal.fire({
          title: title,
          text: mensaje,
          icon: 'success',
          toast: true,
          showConfirmButton: false,
        });
        break;
      case 'danger':
      case 'error':
        Swal.fire({
          title: title,
          text: mensaje,
          icon: 'error',
          toast: true,
          showConfirmButton: false,
        });
        break;
      case 'warning':
        Swal.fire({
          title: title,
          text: mensaje,
          icon: 'warning',
          toast: true,
          showConfirmButton: false,
        });
        break;
      case 'info':
        Swal.fire({
          title: title,
          text: mensaje,
          icon: 'info',
          toast: true,
          showConfirmButton: false,
        });
        break;
      case 'question':
        Swal.fire({
          title: title,
          text: mensaje,
          icon: 'question',
          toast: true,
          showConfirmButton: false,
        });
        break;
    }
  }

  closeDialog() {
    Swal.close();
  }

  async doRequest(
    url: string,
    params: string | object,
    callBack: (value: any) => void,
    type: string,
    headers: any = {},
    fallback?: Function
  ) {
    let load = {
      title: 'Cargando',
      html: 'Espere por favor...',
      allowOutsideClick: false,
      allowEnterKey: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    };

    if (!params.hasOwnProperty('DisableLoad')) Swal.fire(load);
    if (typeof params == 'string')
      if (!params.includes('DisableLoad')) Swal.fire(load);

    const errorHandler = (er: any) => {
      let disableEr = false;
      if (params.hasOwnProperty('DisableEr')) disableEr = true;
      if (typeof params == 'string')
        if (params.includes('DisableEr')) disableEr = true;

      if (!disableEr)
        this.presentToast(
          'Error: ',
          'No se ha podido comunicar con el servidor. Contacte soporte en caso de que persista',
          'error'
        );

      fallback && fallback(er);
    };

    switch (type.toUpperCase()) {
      case 'GET':
        this.httpClient
          .get(url, headers)
          .pipe(map((resp) => resp))
          .subscribe({ next: callBack, error: errorHandler });
        break;

      case 'POST':
        this.httpClient
          .post(url, params, headers)
          .pipe(map((resp) => resp))
          .subscribe({ next: callBack, error: errorHandler });
        break;
    }
  }

  getUserClaims() {
    let parsedSession = 'PUBLIC';
    return new HttpHeaders({
      Authorization: 'Bearer ' + parsedSession,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    });
  }

  getFacturas(
    userData: string,
    callBack: (value: any) => void,
    fallback?: () => void
  ) {
    this.doRequest(
      `${this.api}/consultas/consultarPoliza?numeroId=${userData}`,
      { DisableLoad: true },
      callBack,
      'get',
      { headers: this.getUserClaims() },
      fallback
    );
  }

  getIdToken(callBack: (value: any) => void) {
    this.doRequest(
      `${environment.api}/proxy${environment.coomeva.getTokenUrl}`,
      {},
      callBack,
      'post',
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  getGenURL(
    IdToken: string,
    genUrlObject: string | object,
    callBack: (value: any) => void
  ) {
    this.doRequest(
      `${environment.api}/proxy${environment.coomeva.getGeneratedUrl}`,
      { requestToken: IdToken, coomevaObject: genUrlObject },
      callBack,
      'post',
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  getEstadoTransaccionWompi(
    transaction_id: string,
    callBack: (value: any) => void,
    fallback: (value: any) => void
  ) {
    this.doRequest(
      `${environment.wompiServer}/transactions/${transaction_id}`,
      { DisableLoad: true, DisableEr: true },
      callBack,
      'get',
      {},
      fallback
    );
  }

  notifyWompiBack(transactionData: any) {
    this.doRequest(
      `${environment.api}/aplicarRecaudo/aplicarWompi`,
      { DisableLoad: true, DisableEr: true, ...transactionData },
      () => {},
      'post'
    );
  }

  notifyKushkiBack(transactionData: any) {
    this.doRequest(
      `${environment.api}/aplicarRecaudo/aplicarKushki`,
      { DisableLoad: true, DisableEr: true, ...transactionData },
      () => {},
      'post'
    );
  }

  crearTransaccionWompi(
    transactionData: any,
    callback: (value: any) => void,
    fallback: (value: any) => void
  ) {
    this.doRequest(
      `${environment.api}/aplicarRecaudo/crearTransaccion`,
      { DisableLoad: true, DisableEr: true, ...transactionData },
      callback,
      'post',
      {},
      fallback
    );
  }

  getPDFBancos(transactionData: any, callback: (value: any) => void) {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('userToken'),
    });
    Swal.fire({
      title: 'Generando Factura',
      html: 'Espere por favor...',
      allowOutsideClick: false,
      allowEnterKey: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    this.httpClient
      .post(`${this.api}/consultas/descargarFactura`, transactionData, {
        headers: headers,
        responseType: 'blob',
      })
      .pipe(
        map((resp) => {
          return resp;
        })
      )
      .subscribe({
        next: callback,
        error: (err) => {
          if (err.status == 404) {
            this.presentToast(
              '¡Atención!',
              'La factura tienen un error que no nos permite generar para pago en bancos. Por favor contacte soporte',
              'warning'
            );
          } else {
            this.presentToast(
              'Error: ',
              'No se ha podido comunicar con el servidor. Contacte soporte en caso de que persista',
              'error'
            );
          }
        },
        complete: () => {
          //Swal.close();
        },
      });
  }
}
