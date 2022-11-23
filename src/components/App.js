import { useEffect, useState } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";

import { API } from "../utils/API.js";
import UserAuth from "../utils/UserAuth";
import { configAPI } from "../utils/constants.js";

import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import Login from "./Login";
import Register from "./Register";
import ProptectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";

import ImagePopup from "../components/ImagePopup";
import PopupConfirm from "../components/PopupConfirm";
import EditProfilePopup from "../components/EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

import {
  CurrentUserContext,
  LoggedInContext,
} from "../contexts/CurrentUserContext";

export default function App() {
  const history = useHistory();

  const api = new API(configAPI);
  const userAuth = new UserAuth();

  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isCardZoomPopupOpen, setCardZoomPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [cardForRemove, setCardForRemove] = useState({});

  const [btnTextAvatarSubmit, setBtnTextAvatarSubmit] = useState("Сохранить");
  const [btnTextUserSubmit, setBtnTextUserSubmit] = useState("Сохранить");
  const [btnTextCardSubmit, setBtnTextCardSubmit] = useState("Создать");
  const [btnTextConfirm, setBtnTextConfirm] = useState("Да");

  // status for info-popup (api requests)
  const [isSuccessful, setIsSuccessful] = useState(false);

  const isPopupOpen = [
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isEditAvatarPopupOpen,
    isCardZoomPopupOpen,
    isConfirmPopupOpen,
    isInfoPopupOpen,
  ].includes(true);

  // first run: get data about gallery and user
  useEffect(() => {
    Promise.all([api.getGalleryData(), api.getUserData()])
      .then(([cardsData, userData]) => {
        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch((err) => console.log(`Ошибка: ${err}`));
  }, []);

  // additional close-funcs by esc and overlay for popups
  useEffect(() => {
    const popUpActive = document.querySelector(".popup_opened");

    if (popUpActive) {
      popUpActive.addEventListener("click", handleClickClose);
      document.addEventListener("keydown", handleEscClose);
    }

    function handleClickClose(evt) {
      if (
        evt.target.classList.contains("popup") ||
        evt.target.classList.contains("popup__container") ||
        evt.target.classList.contains("popup__img-container")
      ) {
        closeAllPopups();
      }
    }

    function handleEscClose(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [isPopupOpen]);

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setCardZoomPopupOpen(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((prevStateCards) =>
          prevStateCards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(`Ошибка: ${err}`));
  }

  // before removing card
  function handleAskConfirmationClick(card) {
    setCardForRemove(card);
    setConfirmPopupOpen(true);
  }

  function onCardRemove() {
    setBtnTextConfirm(() => "Удаление...");
    api
      .removePhotoCard(cardForRemove._id)
      .then(() => {
        setCards((prevGallery) =>
          prevGallery.filter((prevCard) => prevCard._id !== cardForRemove._id)
        );
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setBtnTextConfirm(() => "Да"));
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setAddPlacePopupOpen(false);
    setConfirmPopupOpen(false);
    setCardZoomPopupOpen(false);

    // popup info
    setIsInfoPopupOpen(false);
    setIsSuccessful(false);

    setSelectedCard({});
    setCardForRemove({});
  }

  function onUserUpdate(userData) {
    setBtnTextUserSubmit(() => "Сохранение...");
    api
      .setUserData(userData)
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setBtnTextUserSubmit(() => "Cохранить"));
  }

  function onAvatarUpdate(avatarLink) {
    setBtnTextAvatarSubmit(() => "Сохранение...");
    api
      .changeUserAvatar(avatarLink)
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setBtnTextAvatarSubmit(() => "Cохранить"));
  }

  function onCardCreate(cardData) {
    setBtnTextCardSubmit(() => {
      return "Создание...";
    });
    api
      .addPhotoCard(cardData)
      .then((newCard) => {
        setCards((prevCards) => {
          return [newCard, ...prevCards];
        });
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setBtnTextCardSubmit(() => "Создать"));
  }

  // login user
  function handleUserLogin(userLoginData) {
    console.log(userLoginData);
    userAuth
      .login(userLoginData)
      .then((data) => {
        console.log(data);
        if (data.token) {
          setLoggedIn(true);
          history.push("/");
        } else {
          setLoggedIn(false);
          setIsSuccessful(false);
          setIsInfoPopupOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoggedIn(false);
        setIsSuccessful(false);
        setIsInfoPopupOpen(true);
      });
  }

  // register user
  function handleUserRegister(userRegisterData) {
    console.log(userRegisterData);
  }
  // logout user
  function handleUserLogout() {
    setLoggedIn(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <LoggedInContext.Provider value={loggedIn}>
        <div className="page page-content">
          <Header onLogOut={handleUserLogout} />

          <Switch>
            <ProptectedRoute
              path="/"
              exact
              component={Main}
              // props for Main:
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleAskConfirmationClick}
              onClose={closeAllPopups}
              cards={cards}
              card={selectedCard}
            />

            <Route exact path="/sign-up">
              <Register onUserRegister={handleUserRegister} />
            </Route>

            <Route exact path="/sign-in">
              <Login onUserLogin={handleUserLogin} />
            </Route>

            <Route>
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onSubmit={onUserUpdate}
            buttonSubmitName={btnTextUserSubmit}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onSubmit={onAvatarUpdate}
            buttonSubmitName={btnTextAvatarSubmit}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onSubmit={onCardCreate}
            buttonSubmitName={btnTextCardSubmit}
          />

          <ImagePopup
            card={selectedCard}
            isOpen={isCardZoomPopupOpen}
            onClose={closeAllPopups}
          />

          <PopupConfirm
            title="Вы уверены?"
            buttonConfirmName={btnTextConfirm}
            isOpen={isConfirmPopupOpen}
            onClose={closeAllPopups}
            onConfirm={onCardRemove}
            card={cardForRemove}
          />

          <InfoTooltip
            isOpen={isInfoPopupOpen}
            onClose={closeAllPopups}
            isSuccessful={isSuccessful}
          />

          <Footer />
        </div>
      </LoggedInContext.Provider>
    </CurrentUserContext.Provider>
  );
}
