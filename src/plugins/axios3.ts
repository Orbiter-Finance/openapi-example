import { $env } from '@/env';
import axios from 'axios';
import { ElNotification } from 'element-plus';
import JSONBIG from 'json-bigint'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  baseURL:'http://ec2-54-238-20-18.ap-northeast-1.compute.amazonaws.com:9095/api/v1'
  //   http://ec2-54-238-20-18.ap-northeast-1.compute.amazonaws.com:9095/api/v1 || 'http://localhost:9095/',
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const http3 = axios.create(config);

http3.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
http3.interceptors.response.use(
  function (response) {
    const respData = response.data;

    if (respData.code != 0) {
        ElNotification({
            title: 'Error',
            message: `${ respData.msg }`,
            type: 'error',
        });
      return Promise.reject(new Error(respData.msg));
    }

    return respData;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);


export default http3;
