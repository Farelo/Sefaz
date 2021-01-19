import { Router } from "@angular/router"
import axios from "axios"

let router: any = Router;

axios.interceptors.request.use(function (config) {
  
  if (JSON.parse(localStorage.getItem('currentUser'))) {
    config.headers['Authorization'] = JSON.parse(localStorage.getItem('currentUser')).accessToken
  }

  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger

  
    if (error.response.status === 401) { // erro na autenticação
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentSettings");
      router.navigate(['/login']);
    }

    if (error.response.status === 0) { // o servidor não responde
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentSettings");
      router.navigate(['/login']);
    }


  // Do something with response error
  return Promise.reject(error);
});

export default axios;