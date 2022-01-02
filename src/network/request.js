import axios from 'axios';

const INSTANCE = axios.create({
  baseURL: 'http://' + require('@/assets/data.json').url + ':8080',
  timeout: 5000,
  withCredentials: true,
  crossDomain: true
});

export function request(config) {
  INSTANCE.interceptors.request.use(config => {
    // TODO
    return config;
  }, err => {
    console.log(err);
  });

  INSTANCE.interceptors.response.use(res => {
    // TODO
    return res;
  }, err => {
    console.log(err);
  });
  return INSTANCE(config);
}