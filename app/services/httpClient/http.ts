import axios from './axios';
import * as auth from './api/auth';
import * as panel from './api/panel';

class Http {
  axios = axios;
  auth = auth;
  panel = panel;
}

const http = new Http();

export default http;
