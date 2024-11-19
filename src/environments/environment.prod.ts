export const environment = {
  production: true,
  //host: 'http://192.168.241.250:30049/tesoreria-services',
  //api: 'http://192.168.241.250:30049/tesoreria-services/api',

  host: 'https://serviciosqa.laequidadseguros.coop/tesoreria-services',
  api: 'https://serviciosqa.laequidadseguros.coop/tesoreria-services/api',
  wompiServer: 'https://production.wompi.co/v1',
  kushkiServer: 'https://api.kushkipagos.com',
  aseguradora: {
    generales: {
      wompi: {
        key: 'pub_prod_xxaVN5lSAGSW4l1wWGTBY1B8l5FdKtKj',
        integrity: 'prod_integrity_5uw2lvFvNk5VTrjLiEqHzgbfXhbhAKsr',
      },
      kushki: {
        kFormId: 'Zi-9dlQrc',
        checkId: 'b164fac68f9c433c98f150fddc56e183',
        publicMerchantId: 'b9cfdff751cb4bbfa0f850a31be5eb11',
      },
    },
    vida: {
      wompi: {
        key: 'pub_prod_WrgHfS6HqGw26PcGvOriY57KfNpIVMJs',
        integrity: 'prod_integrity_37kHhJiMEhjZY66ZenShGYt4Z1HOoNy3',
      },
      kushki: {
        kFormId: 'dCrfT6N0y',
        checkId: 'c3db60d32ac54b69944d8f8aa9f74b2a',
        publicMerchantId: 'f04b135035b9498f91d12a837ba0d652',
      },
    },
  },
  coomeva: {
    getTokenUrl: 'https://s5s6nqk77i.execute-api.us-east-1.amazonaws.com',
    getGeneratedUrl: 'https://s5s6nqk77i.execute-api.us-east-1.amazonaws.com',
    username: 'equi1234',
    password: 'lzD4$AF0',
  },
};
