import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { ApiService } from '../../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-transaccion',
  templateUrl: './transaccion.component.html',
  styleUrls: ['./transaccion.component.scss'],
})
export class TransaccionComponent implements OnInit {
  public checkoutMethod: string = '';
  public resultID: string = '';
  public transactionID: string = '';

  public estadoTransaccion: string = '';
  public valorPago: number = 0;
  public fechaPago = '';
  public desdePago = '';
  public productoPago = '';

  public state: string = 'p';

  public genPDF: boolean = false;

  constructor(private route: ActivatedRoute, private service: ApiService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.checkoutMethod = params['check'];
      this.resultID = params['rID'];
      this.transactionID = params['id'];

      if (this.checkoutMethod === 'wompi') {
        this.service.getEstadoTransaccionWompi(
          this.transactionID,
          (wompiResponse) => {
            this.service.notifyWompiBack({
              check: this.checkoutMethod,
              rID: this.resultID,
              wID: this.transactionID,
            });

            this.valorPago = wompiResponse.data.amount_in_cents / 100;
            this.fechaPago = wompiResponse.data.created_at;
            this.desdePago = wompiResponse.data.payment_method_type;
            this.productoPago =
              wompiResponse.data.payment_method.payment_description;

            switch (wompiResponse.data.status) {
              case 'PENDING':
                this.state = 'p';
                setTimeout(() => this.ngOnInit(), 5000);
                break;
              case 'APPROVED':
                this.state = 'e';
                break;
              case 'DECLINED':
                this.state = 'd';
                break;
              case 'VOIDED':
                this.state = 'v';
                break;
              default:
                this.state = 'f';
                break;
            }
          },
          () => {
            this.state = 'f';
            this.fechaPago = new Date().toISOString();
            this.desdePago = 'Ningún banco';
            this.productoPago = 'No existe transacción';
          }
        );
      } else if (this.checkoutMethod === 'kushki') {
        const kushkiToken = params['token'];
        const kushkiInsu: keyof typeof environment.aseguradora =
          params['insurance'];
        const urlRequest = `${environment.kushkiServer}/transfer/v1/status/${kushkiToken}`;
        this.service.doRequest(
          `${environment.api}/aplicarRecaudo/transferStatus?proxyRequest=${urlRequest}&merchantId=${environment.aseguradora[kushkiInsu].kushki.checkId}`,
          { DisableLoad: true },
          (kushkiTransactionResult) => {
            console.log(kushkiTransactionResult);

            this.resultID = kushkiTransactionResult.metadata.equidadReference;

            if (kushkiTransactionResult.status === 'approvedTransaction') {
              this.state = 'e';
              this.valorPago = kushkiTransactionResult.amount.subtotalIva0;
              this.fechaPago = new Date(
                kushkiTransactionResult.created
              ).toISOString();
              this.desdePago = kushkiTransactionResult.transferProcessor;
              this.productoPago = kushkiTransactionResult.transactionReference;
            } else if (
              kushkiTransactionResult.status === 'initializedTransaction'
            ) {
              this.state = 'p';
              this.valorPago = kushkiTransactionResult.amount.subtotalIva0;
              this.fechaPago = new Date().toISOString();
              this.desdePago = kushkiTransactionResult.transferProcessor;
              this.productoPago = kushkiTransactionResult.transactionReference;
            } else if (
              kushkiTransactionResult.status === 'declinedTransaction'
            ) {
              this.state = 'd';
              this.valorPago = kushkiTransactionResult.amount.subtotalIva0;
              this.fechaPago = new Date().toISOString();
              this.desdePago = kushkiTransactionResult.transferProcessor;
              this.productoPago = kushkiTransactionResult.transactionReference;
            } else {
              this.state = 'f';
              this.valorPago = kushkiTransactionResult.amount.subtotalIva0;
              this.fechaPago = new Date().toISOString();
              this.desdePago = kushkiTransactionResult.transferProcessor;
              this.productoPago = kushkiTransactionResult.transactionReference;
            }
          },
          'get',
          {
            headers: {},
          },
          () => {}
        );
      }
    });
  }

  getEstatus() {
    switch (this.state) {
      case 'e':
        this.estadoTransaccion = 'fue exitoso';
        break;
      case 'p':
        this.estadoTransaccion = 'está pendiente';
        break;
      case 'f':
        this.estadoTransaccion = 'ha fallado';
        break;
      case 'd':
        this.estadoTransaccion = 'fue declinado';
        break;
      case 'v':
        this.estadoTransaccion = 'fue anulado';
        break;
    }

    return this.estadoTransaccion;
  }

  downloadPDF() {
    this.genPDF = true;
    const DATA: HTMLElement =
      document.getElementById('ticketTransaction') || new HTMLElement();
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3,
    };

    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        this.genPDF = false;
        docResult.save(
          `transaction_${this.transactionID}_${new Date().toISOString()}.pdf`
        );
      });
  }
}
