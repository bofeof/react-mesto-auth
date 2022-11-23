import { useEffect } from "react";

export default function PopupWithForm(props) {
  return (
    <div
      className={`popup popup_type_${props.name} ${
        props.isOpen ? "popup_opened" : ""
      }`}>
      <div className="popup__container">
        <button
          type="button"
          className="popup__close-button"
          onClick={props.onClose}></button>
        <div className="popup__form">
          <h3 className="popup__form-header">{props.title}</h3>

          <form
            name={`${props.name}`}
            className="popup__form-inputs"
            noValidate
            onSubmit={props.onSubmit}>
            {/* inputs area */}
            {props.children}

            <button
              className={`popup__button popup__submit-button popup__save-button ${
                !props.isButtonEnable ? "popup__button_disabled" : ""
              }`}
              type="submit"
              name="save"
              disabled={!props.isButtonEnable}>
              {props.buttonSubmitName}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
