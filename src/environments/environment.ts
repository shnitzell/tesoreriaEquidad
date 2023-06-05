// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  host: 'http://localhost:4200',
  api: 'http://yatchrend',
  wompiKey: 'pub_test_nhyj4PZUuBYW4a13cHRnHiJVOCh2bzQl',
  wompiServer: 'https://sandbox.wompi.co/v1',
  coomeva: {
    getTokenUrl: 'http://localhost:4200/get_tokens_convenio_empresa',
    getGeneratedUrl: 'http://localhost:4200/generate_url',
    username: 'ESeg0523',
    password: '6ik=2pkH',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
