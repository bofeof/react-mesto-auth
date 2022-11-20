import { formValidator } from '../utils/formValidator';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import React, { useEffect, useState, useRef, useContext } from 'react';

export default function EditAvatarPopup({ isOpen, onClose, onSubmit, buttonSubmitName }) {
  const currentUser = useContext(CurrentUserContext);
  const avatarRef = useRef();

  /**validation sets */
  const [avatarValidation, setAvatarValidation] = useState({ isValid: true, errorText: '' });
  const buttonStatus = ![avatarValidation.isValid].includes(false);

  useEffect(() => {
    avatarRef.current.value = currentUser.avatar;
    setAvatarValidation((params) => ({ ...params, isValid: true, errorText: '' }));
  }, [isOpen]);

  function handleAvatarChange(evt) {
    const validationResult = formValidator(evt);
    setAvatarValidation((params) => ({ ...params, isValid: validationResult.isValid, errorText: validationResult.errorText }));
  }

  function handleAvatarSubmit(evt) {
    evt.preventDefault();
    onSubmit({ avatar: avatarRef.current.value });
    onClose();
  }

  return (
    <PopupWithForm
      name="change-avatar"
      title="Обновить аватар"
      buttonSubmitName={buttonSubmitName}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleAvatarSubmit}
      isButtonEnable={buttonStatus}
    >
      <>
        <input
          className="popup__input popup__input_form_avatar"
          type="url"
          name="avatar"
          placeholder="Ссылка на аватар"
          id="url-input-avatar"
          required="required"
          ref={avatarRef}
          onChange={handleAvatarChange}
        />

        <span className="popup__input-error url-input-avatar-error">{avatarValidation.errorText}</span>
      </>
    </PopupWithForm>
  );
}
