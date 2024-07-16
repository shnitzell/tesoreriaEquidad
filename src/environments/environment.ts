// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  host: 'http://localhost:8090',
  api: 'http://localhost:8090/api',
  wompiServer: 'https://sandbox.wompi.co/v1',
  aseguradora: {
    generales: {
      wompi: {
        key: 'pub_test_nhyj4PZUuBYW4a13cHRnHiJVOCh2bzQl',
        integrity: 'test_integrity_9TPATASgm3HViHWNuLBMqSDA8TlWFiNQ',
      },
      kushki: {
        kFormId: 'GXInX0CWI',
        publicMerchantId: 'beda4a9f308c487bb11d84e41f296db0',
      },
    },
    vida: {
      wompi: {
        key: 'pub_test_YSJjFgZxjb9W9RCxOKh8iK5CpP43Fgwf',
        integrity: 'test_integrity_B27Anogx7gQbi4VOf87OFCQ7TniJ7u6a',
      },
      kushki: {
        kFormId: 'VgrLrH_CK',
        publicMerchantId: 'd59933a708a54b979edd40b23f9a4ad4',
      },
    },
  },
  coomeva: {
    getTokenUrl: 'https://f9dgaih2rj.execute-api.us-east-1.amazonaws.com',
    getGeneratedUrl: 'https://f9dgaih2rj.execute-api.us-east-1.amazonaws.com',
    username: 'equi1234',
    password: 'lzD4$AF0',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
