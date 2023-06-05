const PROXY_CONFIG = {
  "/get_tokens_convenio_empresa": {
    target: "https://f9dgaih2rj.execute-api.us-east-1.amazonaws.com",
    changeOrigin: true,
    secure: false,
    logLevel: "debug",
  },
  "/generate_url": {
    target: "https://f9dgaih2rj.execute-api.us-east-1.amazonaws.com",
    changeOrigin: true,
    secure: false,
    logLevel: "debug",
  },
};
module.exports = PROXY_CONFIG;
