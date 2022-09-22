import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";

import Swal from 'sweetalert2';

declare var $: any;

@Injectable({
    providedIn: 'root'
})
export class ApiService {
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
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;
            if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        })
    }

    async presentAlertConfirm(title, mensaje, additionalOpt: any = null, callback = null) {

        let options = {
            title: title,
            text: mensaje
        }

        if (additionalOpt) {
            for (let it in additionalOpt) {
                options[it] = additionalOpt[it];
            }
        }

        Swal.fire(options).then(callback);
    }

    async presentToast(title, mensaje, type = "success") {
        switch (type) {
            case "success":
                Swal.fire({ title: title, text: mensaje, icon: "success", toast: true, showConfirmButton: false });
                break;
            case "danger":
            case "error":
                Swal.fire({ title: title, text: mensaje, icon: "error", toast: true, showConfirmButton: false });
                break;
            case "warning":
                Swal.fire({ title: title, text: mensaje, icon: "warning", toast: true, showConfirmButton: false });
                break;
            case "info":
                Swal.fire({ title: title, text: mensaje, icon: "info", toast: true, showConfirmButton: false });
                break;
            case "question":
                Swal.fire({ title: title, text: mensaje, icon: "question", toast: true, showConfirmButton: false });
                break;
        }
    }

    closeDialog() {
        Swal.close();
    }

    async doRequest(url, params, callBack, type, headers: any = {}) {

        let load = {
            title: 'Cargando',
            html: 'Espere por favor...',
            allowOutsideClick: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        }

        if (!params.hasOwnProperty("DisableLoad")) Swal.fire(load);
        if (typeof params == "string") if (!params.includes("DisableLoad")) Swal.fire(load);

        switch (type.toUpperCase()) {
            case 'GET':
                this.httpClient.get(url, headers)
                    .pipe(map(resp => resp))
                    .subscribe(callBack, er => {
                        this.presentToast("Error: ", er, "error");
                        //Swal.close();
                    }, () => {
                        //Swal.close();
                    });
                break;

            case 'POST':
                this.httpClient.post(url, params, headers)
                    .pipe(map(resp => resp))
                    .subscribe(callBack, er => {
                        try {
                            er = JSON.stringify(er);
                            this.presentToast("Error: ", er, "error");
                        } catch (e) {
                            this.presentToast("Error: ", er, "error");
                        }
                        //Swal.close();                               
                    }, () => {
                        //Swal.close();
                    });
                break;
        }

    };

    getUserClaims() {
        let parsedSession = "PUBLIC";
        return new HttpHeaders({
            'Authorization': 'Bearer ' + parsedSession,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });

    }

    getFacturas(userData: string, callBack) {
        this.doRequest(`${this.api}/consultas/consultarPoliza.php?numeroId=${userData}`, { DisableLoad: true }, callBack, 'get', { headers: this.getUserClaims() });
    }

}