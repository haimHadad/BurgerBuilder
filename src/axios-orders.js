import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-a69cd-default-rtdb.firebaseio.com/'
});

export default instance;