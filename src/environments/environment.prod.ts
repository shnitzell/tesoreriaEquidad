export const environment = {
  production: true,
  //host: 'http://192.168.241.250:30049/tesoreria-services',
  //api: 'http://192.168.241.250:30049/tesoreria-services/api',

  host: 'https://serviciosqa.laequidadseguros.coop/tesoreria-services',
  api: 'https://serviciosqa.laequidadseguros.coop/tesoreria-services/api',
  wompiServer: 'https://sandbox.wompi.co/v1',
  kushkiServer: 'https://api-uat.kushkipagos.com',
  aseguradora: {
    generales: {
      wompi: {
        key: 'pub_prod_xxaVN5lSAGSW4l1wWGTBY1B8l5FdKtKj',
        integrity: 'prod_integrity_5uw2lvFvNk5VTrjLiEqHzgbfXhbhAKsr',
      },
      kushki: {
        kFormId: 'GXInX0CWI',
        checkId: '37752510ae1c403cac7416984faa9b21',
        publicMerchantId: 'beda4a9f308c487bb11d84e41f296db0',
      },
    },
    vida: {
      wompi: {
        key: 'pub_prod_WrgHfS6HqGw26PcGvOriY57KfNpIVMJs',
        integrity: 'prod_integrity_37kHhJiMEhjZY66ZenShGYt4Z1HOoNy3',
      },
      kushki: {
        kFormId: 'VgrLrH_CK',
        checkId: '695410d55b004dba99ff2562a78f1df3',
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
