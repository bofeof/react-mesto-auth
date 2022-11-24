const BASE_URL = 'https://auth.nomoreparties.co';

function getResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    res.json().then((errText) => console.log('Дополнительное сообщение с сервера:', errText || '-'));
    return Promise.reject(`Ошибка: ${res.status}, ${res.statusText}`);
  }
}

export function register(userData) {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then((res) => getResponse(res))
    .then((res) => res)
    .catch((err) => console.log(err));
}

export function login(userData) {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then((res) => getResponse(res))
    .then((res) => res)
    .catch((err) => console.log(err));
}

export function checkToken(token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${localStorage.getItem('mestoToken')}`,
    },
  })
    .then((res) => getResponse(res))
    .then((res) => res)
    .catch((err) => console.log(err));
}
