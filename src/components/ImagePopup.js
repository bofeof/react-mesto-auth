import { useEffect } from 'react';

export default function ImagePopup({ card, isOpen, onClose }) {
  // additional close-func by esc and overlay for popup
  useEffect(() => {
    const popUpActive = document.querySelector('.popup_opened');

    if (popUpActive) {
      popUpActive.addEventListener('click', handleClickClose);
      document.addEventListener('keydown', handleEscClose);
    }

    function handleClickClose(evt) {
      if (
        evt.target.classList.contains('popup') ||
        evt.target.classList.contains('popup__container') ||
        evt.target.classList.contains('popup__img-container')
      ) {
        onClose();
      }
    }

    function handleEscClose(evt) {
      if (evt.key === 'Escape') {
        onClose();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`popup popup_zoom_img ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__img-container">
        <button type="button" className="popup__close-button" onClick={onClose}></button>
        <div className="popup__img-figure">
          <figure className="popup__img">
            <img className="popup__img-card" src={card?.link} alt={card?.name} />
            <figcaption className="popup__img-caption">{card?.name}</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
