import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus : 200,
    duration : '30s',
};

export default function (){
    const id = Math.floor(Math.random() * 100) + 1;
    const res = http.get(`http://host.docker.internal:3000/api/products/${id}/stock`);
    check(res, {'status was 200': (r)=> r.status === 200});
    sleep(0.05);
}