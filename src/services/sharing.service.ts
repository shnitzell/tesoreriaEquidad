import { Injectable } from '@angular/core';

@Injectable()
export class SharingService {
    private sharingObject: any;
    constructor() { }

    get sharingValue() {
        return this.sharingObject
    }

    set sharingValue(obj) {
        this.sharingObject = obj;
    }
}