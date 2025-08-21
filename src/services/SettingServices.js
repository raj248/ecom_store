import requests from "./httpServices";

const SettingServices = {
  //store setting all function
  getStoreSetting: async () => {
    return requests.get("/setting/store-setting");
  },

  getStoreSeoSetting: async () => {
    return requests.get("/setting/store-setting/seo");
  },
  //store customization setting all function
  getStoreCustomizationSetting: async () => {
    return requests.get("/setting/store/customization");
  },

  getShowingLanguage: async () => {
    return requests.get(`/language/show`);
  },

  getGlobalSetting: async () => {
    return requests.get("/setting/global");
  },
};

export default SettingServices;
