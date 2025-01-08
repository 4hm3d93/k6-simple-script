import http from 'k6/http';
import { check, sleep } from 'k6';
import { URLSearchParams } from 'https://jsc.k6.io/web/url';

const baseUrl = 'https://loyalty.example.com';
const loginPagePath = '/login';
const homePagePath = '/home';
const emailInputField = '#email';
const passwordInputField = '#password';
const userEmail = 'testuser@monri.ba';
const userPassword = 'LoyaltyWebApp123!';
const sleepDuration = 1;

export const options = {
  scenarios: {
    login_flow: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 200 },
        { duration: '1m', target: 4000 },
        { duration: '30s', target: 4000 },
        { duration: '10s', target: 8000 },
        { duration: '2m', target: 8000 },
        { duration: '10s', target: 0 },
      ],
      gracefulStop: '5s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration ['p(95)<200', 'avg < 400'],
    http_req_receiving: ['avg < 2000'],
    http_req_sending: ['avg < 0.3'],
    http_req_tls_handshaking: ['avg < 50'],
    http_req_waiting: ['avg < 2000'],
    iteration_duration: ['avg < 15000'],
  },
};

export default function () {
  const loginUrl = `${baseUrl}${loginPagePath}`;
  const params = new URLSearchParams();
  params.append(emailInputField.slice(1), userEmail);
  params.append(passwordInputField.slice(1), userPassword);
  const requestBody = params.toString();
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  let loginResponse = http.post(loginUrl, requestBody, {
    headers: headers,
    tags: { name: 'Login request' },
  });

  check(loginResponse, {
    'Login status is 200': (r) => r.status === 200,
    'Login response should have a content': (r) => r.body.length > 0,
    'Login response should contain the home path': (r) =>
      r.url.includes(homePagePath),
  });
  sleep(sleepDuration);
}