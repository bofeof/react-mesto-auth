import { formValidator } from '../utils/formValidator';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import React, { useState, useEffect, useContext } from 'react';

export default function EditProfilePopup({ isOpen, onClose, onSubmit, buttonSubmitName }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState(currentUser.name);
  const [description, setDescription] = useState(currentUser.about);

 /**validation sets */
  const [nameValidation, setNameValidation] = useState({ isValid: true, errorText: '' });
  const [aboutValidation, setAboutValidation] = useState({ isValid: true, errorText: '' });
  const buttonStatus = ![nameValidation.isValid, aboutValidation.isValid].includes(false);

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);

    setNameValidation((params) => ({ ...params, isValid: true, errorText: '' }));
    setAboutValidation((params) => ({ ...params, isValid: true, errorText: '' }));
  }, [isOpen]);

  function handleUserChange(evt) {
    const value = evt.target.value;
    const validationResult = formValidator(evt);

    if (evt.target.name === 'name') {
      setNameValidation((params) => ({ ...params, isValid: validationResult.isValid, errorText: validationResult.errorText }));
      setName(value);
    } else {
      setAboutValidation((params) => ({ ...params, isValid: validationResult.isValid, errorText: validationResult.errorText }));
      setDescription(value);
    }
  }

  function handleUserSubmit(evt) {
    evt.preventDefault();
    onSubmit({ name: name, about: description });
    onClose();
  }

  return (
    <PopupWithForm
      name="edit-user"
      title="Редактировать профиль"
      buttonSubmitName={buttonSubmitName}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleUserSubmit}
      isButtonEnable={buttonStatus}
    >
      <>
        <input
          className="popup__input popup__input_form_name"
          type="text"
          name="name"
          id="username-input"
          placeholder="Имя"
          minLength="2"
          maxLength="40"
          required="required"
          onChange={handleUserChange}
          value={name || ''}
        />
        <span className="popup__input-error username-input-error"> {nameValidation.errorText}</span>

        <input
          className="popup__input popup__input_form_job"
          type="text"
          name="about"
          id="jobinfo-input"
          placeholder="О себе"
          minLength="2"
          maxLength="200"
          required="required"
          onChange={handleUserChange}
          value={description || ''}
        />
        <span className="popup__input-error jobinfo-input-error">{aboutValidation.errorText}</span>
      </>
    </PopupWithForm>
  );
}
