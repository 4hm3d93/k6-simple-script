import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = 'https://loyalty.example.com';
const loginPagePath = '/login';
const dashboardPath = '/home';
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
        { duration: '10s', target: 100 },
        { duration: '1m', target: 4000 },
        { duration: '30s', target: 4000 },
        { duration: '10s', target: 0 },
      ],
      gracefulStop: '5s',
    },
  },
};

export default function () {
  const loginUrl = `${baseUrl}${loginPagePath}`;
  const requestBody = {
    [emailInputId.slice(1)]: userEmail,
    [passwordInputId.slice(1)]: userPassword,
  };
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };


  let loginResponse = http.post(loginUrl, requestBody, {headers: headers});

  check(loginResponse, {
    'Login status is 200': (r) => r.status === 200,
  });

  sleep(sleepDuration);
}
