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
        checkId: '',
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
        checkId: '',
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
