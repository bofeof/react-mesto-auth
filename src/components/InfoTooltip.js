export default function InfoTooltip({ isOpen, onClose, isSuccessful }) {
  return (
    <div className={`popup popup__info ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button
          type="button"
          className="popup__close-button"
          onClick={onClose}></button>
        <div className="popup__form popup__info">
          <div
            className={`popup__info-status ${
              isSuccessful ? "popup__info-ok" : "popup__info-err"
            }`}></div>
          <h3 className="popup__info-text">
            {isSuccessful
              ? "Вы успешно зарегистрировались!"
              : "Что-то пошло не так! Попробуйте ещё раз."}
          </h3>
        </div>
      </div>
    </div>
  );
}
