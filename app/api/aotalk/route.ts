import axios from "axios";

// export const AOTALK_BASE_URL = "https://aotalk.taouniverse.top";
export const AOTALK_BASE_URL = "/proxy";

export const API = {
  code: "/api/code",
  account: {
    login: "/api/login",
    register: "/api/register",
  },
};

const getApiURL = (url: string) => {
  return AOTALK_BASE_URL + url;
};

export const AOPost = (api: string, data: any) => {
  return new Promise((resolve, reject) => {
    const url = getApiURL(api);
    axios
      .post(url, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};
