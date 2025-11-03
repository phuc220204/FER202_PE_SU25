import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const request = async (
  method,
  endpoint,
  { body = {}, params = {}, headers = {} } = {}
) => {
  try {
    const res = await api({
      url: endpoint,
      method,
      data: body,
      params,
      headers,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const get = (endpoint, params = {}, headers = {}) =>
  request("GET", endpoint, { params, headers });

export const post = (endpoint, body = {}, params = {}, headers = {}) =>
  request("POST", endpoint, { body, params, headers });

export const put = (endpoint, body = {}, params = {}, headers = {}) =>
  request("PUT", endpoint, { body, params, headers });

export const remove = (endpoint, params = {}, headers = {}) =>
  request("DELETE", endpoint, { params, headers });

export default api;
