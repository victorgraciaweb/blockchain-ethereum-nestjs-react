export const AppConfiguration = () => ({
    urlVersion: process.env.URL_VERSION,
    port: process.env.PORT,
    rpcProviderEnvironment: process.env.RPC_PROVIDER_ENVIRONMENT,
    networksJsonPathFile: process.env.NETWORKS_JSON_PATH_FILE,
    networksJsonPathFolder: process.env.NETWORKS_JSON_PATH_FOLDER,
    networksDataPath: process.env.NETWORKS_DATA_PATH,
});