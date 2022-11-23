const BASE_URL = "https://api.nomoreparties.co";

export default class UserAuth {
  constructor(userData) {
    this._userData = userData;
  }

  //   get err message while login\register
  _getErrMessage(err) {
    switch (err.status) {
      case 400:
        return `Ошибка: ${err.status}. Не передано одно из полей`;
      case 401:
        return `Ошибка: ${err.status}. Пользователь с email не найден `;
      default:
        return `Ошибка: ${err.status}`;
    }
  }

  login() {
    return fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: this._userData,
    })
      .then((res) => {
        try {
          if (res.status === 200) {
            return res.json();
          }
        } catch (err) {
          return err;
        }
      })
      .then((res) => res)
      .catch((err) => this._getErrMessage(err));
  }

  register() {
    return fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: this._userData,
    })
      .then((res) => {
        try {
          if (res.status === 200) {
            return res.json;
          }
        } catch (err) {
          return err;
        }
      })
      .then((res) => res)
      .catch((err) => this._getErrMessage(err));
  }

  getContent(token) {
    return fetch(`${BASE_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        try {
          if ((res.status = 200)) {
            return res.json();
          }
        } catch (err) {
          return err;
        }
      })
      .then((res) => res)
      .catch((err) => {
        if ((err.status = 400)) {
          return `Ошибка: ${err.status}. Токен не передан или передан не в том формате`;
        }
        if ((err.status = 401)) {
          return `Ошибка: ${err.status}. Переданный токен некорректен `;
        }
        return `Ошибка: ${err.status}`;
      });
  }
}
