import { formValidator } from '../utils/formValidator';
import PopupWithForm from './PopupWithForm';
import React, { useEffect, useState } from 'react';

export default function AddPlacePopup({ isOpen, onClose, onSubmit, buttonSubmitName }) {
  const [cardName, setCardName] = useState('');
  const [cardLink, setCardLink] = useState('');

  /**validation sets */
  const [nameValidation, setNameValidation] = useState({ isValid: false, errorText: '' });
  const [linkValidation, setLinkValidation] = useState({ isValid: false, errorText: '' });
  const buttonStatus = ![nameValidation.isValid, linkValidation.isValid].includes(false);

  useEffect(() => {
    setCardName('');
    setCardLink('');
    setNameValidation((params) => ({ ...params, isValid: false, errorText: '' }));
    setLinkValidation((params) => ({ ...params, isValid: false, errorText: '' }));
  }, [isOpen]);

  function handleCardChange(evt) {
    const value = evt.target.value;
    const validationResult = formValidator(evt);

    if (evt.target.name === 'name') {
      setCardName(value);
      setNameValidation((params) => ({ ...params, isValid: validationResult.isValid, errorText: validationResult.errorText }));
    } else {
      setCardLink(value);
      setLinkValidation((params) => ({ ...params, isValid: validationResult.isValid, errorText: validationResult.errorText }));
    }
  }

  function handleCardSubmit(evt) {
    evt.preventDefault();
    onSubmit({ name: cardName, link: cardLink });
    onClose();
  }

  return (
    <PopupWithForm
      name="create-card"
      title="Новое место"
      buttonSubmitName={buttonSubmitName}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleCardSubmit}
      isButtonEnable={buttonStatus}
    >
      <>
        <input
          className="popup__input popup__input_form_photoname"
          type="text"
          name="name"
          id="photoname-input"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          required="required"
          value={cardName}
          onChange={handleCardChange}
        />
        <span className="popup__input-error photoname-input-error">{nameValidation.errorText}</span>

        <input
          className="popup__input popup__input_form_photolink"
          type="url"
          name="link"
          placeholder="Ссылка на картинку"
          id="url-input"
          required="required"
          value={cardLink}
          onChange={handleCardChange}
        />
        <span className="popup__input-error url-input-error">{linkValidation.errorText}</span>
      </>
    </PopupWithForm>
  );
}
