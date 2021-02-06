import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';

const request =
{
  "investmentDate": "2016-05-10",
  "cdbRate": 100,
  "currentDate": "2016-12-22"
}

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 2 minutes.
    { duration: '2m', target: 100 }, // stay at 100 users for 2 minutes
    { duration: '1m', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
};

const BASE_URL = __ENV.API_BASE || 'http://localhost:8080';
const HEADERS = { 'Content-Type': 'application/json' };

const params = {
  headers: HEADERS
}
const url = `${BASE_URL}`

export default () => {
  group('Functional Tests', function () {
    const queryHC = http.get(`${url}/api/v1/hc`);
    if (!check(queryHC, {
      'Health Check API must return status code 200': (r) => r.status === 200
    })) fail('Error on check Health Check API')

    const payload = JSON.stringify(request)
    const queryCalc = http.post(`${url}/api/v1/calculate/cdb`,payload, params)
    if (!check(queryCalc, {
      'Post to alculate cdb route must return status code 200': (r) => r.status === 200
    })) fail('Error on response from calculate cdb route')

    request.cdbRate += 1
    console.log(`cdbRate used in request=${request.cdbRate}`)
    sleep(1)
  })}