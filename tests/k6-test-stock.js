import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

export let options = {
    vus: 300,
    duration: '30s'
};

let latencyTrend =  new Trend('latency_ms');

export default function () {
    const id = Math.floor(Math.random() * 1000) + 1;

    const res = http.get(`http://host.docker.internal:3000/api/products/${id}/stock`);

    latencyTrend.add(res.timings.duration);

    check(res, { 'status was 200 ': (r)=> r.status === 200 });

    sleep(0.05);
}