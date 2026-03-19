import axios from 'axios';

const api = axios.create ({
    baseURL : "http://localhost:7122/api", //qitu e vendosum portin aktiv t'back end
    withCredentials: true,

});

export default api;