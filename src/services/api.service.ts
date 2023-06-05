import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';

declare var $: any;

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

  generateUUID() {
    var d = new Date().getTime();
    var d2 =
      (typeof performance !== 'undefined' &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16;
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
    title,
    mensaje,
    additionalOpt: any = null,
    callback = null
  ) {
    let options = {
      title: title,
      text: mensaje,
    };

    if (additionalOpt) {
      for (let it in additionalOpt) {
        options[it] = additionalOpt[it];
      }
    }

    Swal.fire(options).then(callback);
  }

  async presentToast(title, mensaje, type = 'success') {
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
    url,
    params,
    callBack,
    type,
    headers: any = {},
    fallback = null
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

    const errorHandler = (er) => {
      let disableEr = false;
      if (params.hasOwnProperty('DisableEr')) disableEr = true;
      if (typeof params == 'string')
        if (params.includes('DisableEr')) disableEr = true;
      try {
        er = JSON.stringify(er);
        if (!disableEr) this.presentToast('Error: ', er, 'error');
      } catch (e) {
        if (!disableEr) this.presentToast('Error: ', er, 'error');
      }
      fallback && fallback(er);
    };

    switch (type.toUpperCase()) {
      case 'GET':
        this.httpClient
          .get(url, headers)
          .pipe(map((resp) => resp))
          .subscribe(callBack, errorHandler);
        break;

      case 'POST':
        this.httpClient
          .post(url, params, headers)
          .pipe(map((resp) => resp))
          .subscribe(callBack, errorHandler);
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

  getFacturas(userData: string, callBack) {
    this.doRequest(
      `${this.api}/consultas/consultarPoliza?numeroId=${userData}`,
      { DisableLoad: true },
      callBack,
      'get',
      { headers: this.getUserClaims() }
    );
  }

  getIdToken(callBack) {
    this.doRequest(
      environment.coomeva.getTokenUrl,
      {
        username: environment.coomeva.username,
        password: environment.coomeva.password,
      },
      callBack,
      'post',
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }),
      }
    );
  }

  getGenURL(IdToken, genUrlObject, callBack) {
    this.doRequest(
      environment.coomeva.getGeneratedUrl,
      genUrlObject,
      callBack,
      'post',
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + IdToken,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }),
      }
    );
  }

  getEstadoTransaccionWompi(transaction_id: string, callBack, fallback) {
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

  crearTransaccionWompi(transactionData: any, callback, fallback) {
    this.doRequest(
      `${environment.api}/aplicarRecaudo/crearTransaccion`,
      { DisableLoad: true, DisableEr: true, ...transactionData },
      callback,
      'post',
      {},
      fallback
    );
  }
}
