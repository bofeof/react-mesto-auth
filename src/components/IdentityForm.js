import { useState, useEffect } from "react";
import { formValidator } from "../utils/formValidator";

export default function IdentityForm({
  header,
  buttonName,
  onClick,
  askSignIn,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailValidation, setEmailValidation] = useState({
    isValid: true,
    errorText: "",
  });

  const [passwordValidation, setPasswordValidation] = useState({
    isValid: true,
    errorText: "",
  });

  const buttonStatus = ![
    emailValidation.isValid,
    passwordValidation.isValid,
  ].includes(false);

  useEffect(() => {
    setEmailValidation((params) => ({
      ...params,
      isValid: false,
      errorText: "",
    }));

    setPasswordValidation((params) => ({
      ...params,
      isValid: false,
      errorText: "",
    }));
  }, []);

  function handleInputChange(evt) {
    const value = evt.target.value;
    const validationResult = formValidator(evt);
    if (evt.target.name === "email") {
      setEmail(value);
      setEmailValidation((params) => ({
        ...params,
        isValid: validationResult.isValid,
        errorText: validationResult.errorText,
      }));
    } else {
      setPassword(value);
      setPasswordValidation((params) => ({
        ...params,
        isValid: validationResult.isValid,
        errorText: validationResult.errorText,
      }));
    }
  }

  function handleFormSubmit(evt) {
    evt.preventDefault();
    onClick({ password: password, email: email });
  }

  return (
    <div className="identity__container">
      <h3 className="identity__header">{header}</h3>
      <form className="identity__form" noValidate>
        <input
          className="identity__form-input"
          type="email"
          name="email"
          autoComplete="username"
          id="email-input"
          placeholder="Email"
          required="required"
          value={email}
          onChange={handleInputChange}></input>
        <span className="identity__input-error">
          {emailValidation.errorText}
        </span>

        <input
          className="identity__form-input"
          type="password"
          name="password"
          autoComplete="current-password"
          id="password"
          minLength="6"
          placeholder="Пароль"
          required="required"
          value={password}
          onChange={handleInputChange}></input>
        <span className="identity__input-error">
          {passwordValidation.errorText}
        </span>

        <button
          className="identity__form-button"
          onClick={handleFormSubmit}
          disabled={!buttonStatus}>
          {buttonName}
        </button>

        {askSignIn}
      </form>
    </div>
  );
}
