import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';

import ImagePopup from '../components/ImagePopup';
import PopupConfirm from '../components/PopupConfirm';
import EditProfilePopup from '../components/EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

import { CurrentUserContext } from '../contexts/CurrentUserContext';

import { API } from '../utils/API.js';
import { configAPI } from '../utils/constants.js';

import { useEffect, useState } from 'react';

export default function App() {
  const api = new API(configAPI);

  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isCardZoomPopupOpen, setCardZoomPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});

  const [btnTextAvatarSubmit, setBtnTextAvatarSubmit] = useState('Сохранить');
  const [btnTextUserSubmit, setBtnTextUserSubmit] = useState('Сохранить');
  const [btnTextCardSubmit, setBtnTextCardSubmit] = useState('Создать');
  const [btnTextConfirm, setBtnTextConfirm] = useState('Да');

  const [cardForRemove, setCardForRemove] = useState({});

  // first run: get data about gallery and user
  useEffect(() => {
    Promise.all([api.getGalleryData(), api.getUserData()])
      .then(([cardsData, userData]) => {
        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch((err) => console.log(`Ошибка: ${err}`));
  }, []);

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
        setCards((prevStateCards) => prevStateCards.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => console.log(`Ошибка: ${err}`));
  }

  // before removing card
  function handleAskConfirmationClick(card) {
    setCardForRemove(card);
    setConfirmPopupOpen(true);
  }

  function onCardRemove() {
    setBtnTextConfirm(() => 'Удаление...');
    api
      .removePhotoCard(cardForRemove._id)
      .then(() => {
        setCards((prevGallery) => prevGallery.filter((prevCard) => prevCard._id !== cardForRemove._id));
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setBtnTextConfirm(() => 'Да'));
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setAddPlacePopupOpen(false);
    setConfirmPopupOpen(false);
    setCardZoomPopupOpen(false);

    setSelectedCard({});
    setCardForRemove({});
  }

  function onUserUpdate(userData) {
    setBtnTextUserSubmit(() => 'Сохранение...');
    api
      .setUserData(userData)
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setBtnTextUserSubmit(() => 'Cохранить'));
  }

  function onAvatarUpdate(avatarLink) {
    setBtnTextAvatarSubmit(() => 'Сохранение...');
    api
      .changeUserAvatar(avatarLink)
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setBtnTextAvatarSubmit(() => 'Cохранить'));
  }

  function onCardCreate(cardData) {
    setBtnTextCardSubmit(() => {
      return 'Создание...';
    });
    api
      .addPhotoCard(cardData)
      .then((newCard) => {
        setCards((prevCards) => {
          return [newCard, ...prevCards];
        });
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setBtnTextCardSubmit(() => 'Создать'));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page page-content">
        <Header />

        <Main
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

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onSubmit={onUserUpdate} buttonSubmitName={btnTextUserSubmit} />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onSubmit={onAvatarUpdate} buttonSubmitName={btnTextAvatarSubmit} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onSubmit={onCardCreate} buttonSubmitName={btnTextCardSubmit} />

        <ImagePopup card={selectedCard} isOpen={isCardZoomPopupOpen} onClose={closeAllPopups} />

        <PopupConfirm
          title="Вы уверены?"
          buttonConfirmName={btnTextConfirm}
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onConfirm={onCardRemove}
          card={cardForRemove}
        />

        <Footer />
      </div>
      
    </CurrentUserContext.Provider>
  );
}
