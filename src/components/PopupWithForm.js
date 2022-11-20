import { useEffect } from 'react';

export default function PopupWithForm(props) {

/** this activity (useEffect) is experimental.
 * it allows to close popups by esc-key or just by clicking popup-overlay */
  useEffect(() => {

    const popUpActive = document.querySelector(".popup_opened");

    if (props.isOpen && popUpActive){
      popUpActive.addEventListener("click", handleClickClose);
      document.addEventListener("keydown", handleEscClose);
    }

    function handleClickClose(evt) {
      if (
        evt.target.classList.contains("popup") ||
        evt.target.classList.contains("popup__container") ||
        evt.target.classList.contains("popup__img-container")
      ) {
        props.onClose();
      }
    }

    function handleEscClose(evt) {
      if (evt.key === "Escape") {
        props.onClose();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
    
  }, [props.isOpen]);

  return (
    <div
      className={`popup popup_type_${props.name} ${
        props.isOpen ? "popup_opened" : ""
      }`}>
      <div className='popup__container'>
        <button
          type='button'
          className='popup__close-button'
          onClick={props.onClose}></button>
        <div className='popup__form'>
          <h3 className='popup__form-header'>{props.title}</h3>

          <form
            name={`${props.name}`}
            className='popup__form-inputs'
            noValidate
            onSubmit={props.onSubmit}>
            {/* inputs area */}
            {props.children}

            <button
              className={`popup__button popup__submit-button popup__save-button ${
                !props.isButtonEnable ? "popup__button_disabled" : ""
              }`}
              type='submit'
              name='save'
              disabled={!props.isButtonEnable}>
              {props.buttonSubmitName}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
