import { LoggedInContext } from "../contexts/CurrentUserContext";
import { useContext, useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

export default function Header({ onLogOut }) {
  const [menuOpened, setMenuOpened] = useState(false);
  const userLogIn = useContext(LoggedInContext);
  const location = useLocation();
  const currentUrl = location.pathname;
  const history = useHistory();

  // update window-width for displaying menu: burger or classic
  const [windowWidth, setWindowWidth] = useState();
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });

  function updateSize() {
    setWindowWidth(window.innerWidth);
  }

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

  function handleOpenMenu() {
    setMenuOpened(!menuOpened);
  }

  return userLogIn ? (
    // LOGIN
    <header className="header">
      <div className="header__logo"></div>
      {windowWidth >= 768 ? (
        // classic menu
        <>
          <div
            className="header__menu"
            onClick={handleOpenMenu}
            style={{ display: "none" }}>
            <div className="header__burger-close"></div>
            <div className="header__menu-burger">
              <span className="header__menu-line"></span>
              <span className="header__menu-line"></span>
              <span className="header__menu-line"></span>
            </div>
          </div>

          <div className="header__user" style={{ display: "flex" }}>
            <p className="header__email">email@email</p>
            <button
              style={{ margin: "0 0 40px" }}
              className="header__button header__logout-button"
              onClick={handleLogOut}>
              Выйти
            </button>
          </div>
        </>
      ) : (
        //  burger-menu
        <>
          <div className="header__menu" onClick={handleOpenMenu}>
            {menuOpened ? (
              <div className="header__burger-close"></div>
            ) : (
              <div className="header__menu-burger">
                <span className="header__menu-line"></span>
                <span className="header__menu-line"></span>
                <span className="header__menu-line"></span>
              </div>
            )}
          </div>

          <div
            className="header__user"
            style={{ display: menuOpened ? "flex" : "none" }}>
            <p className="header__email">email@email</p>
            <button
              style={{ margin: "0 0 40px" }}
              className="header__button header__logout-button"
              onClick={handleLogOut}>
              Выйти
            </button>
          </div>
        </>
      )}
    </header>
  ) : (
    // LOGOUT
    <header
      className="header"
      style={{ gridTemplateAreas: `'header__logo header__menu header__user'` }}>
      <div className="header__logo"></div>
      <div className="header__user">
        <div className="header__burger-close" style={{ display: "none" }}></div>
        <div className="header__menu-burger" style={{ display: "none" }}>
          <span className="header__menu-line"></span>
          <span className="header__menu-line"></span>
          <span className="header__menu-line"></span>
        </div>
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
    </header>
  );
}
