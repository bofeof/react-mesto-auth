import { LoggedInContext } from "../contexts/CurrentUserContext";
import { useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";

export default function Header({ onLogOut }) {
  const userLogIn = useContext(LoggedInContext);
  const location = useLocation();
  const currentUrl = location.pathname;
  const history = useHistory();

  function handleLogOut() {
    onLogOut();
  }

  function handleRedirect(evt) {
    evt.preventDefault();
    if (currentUrl === "/sign-up") {
      history.push("/sign-in");
    } else {
      history.push("/sign-up");
    }
  }

  return (
    <header className="header">
      <div className="header__logo"></div>
      {userLogIn ? (
        <div className="header__user">
          <p className="header__email">email@email</p>
          <button
            className="header__button header__logout-button"
            onClick={handleLogOut}>
            Выйти
          </button>
        </div>
      ) : (
        <div className="header__user">
          {currentUrl === "/sign-in" && (
            <button className="header__button" onClick={handleRedirect}>
              Регистрация
            </button>
          )}
          {currentUrl === "/sign-up" && (
            <button className="header__button" onClick={handleRedirect}>
              Войти
            </button>
          )}
        </div>
      )}
    </header>
  );
}
