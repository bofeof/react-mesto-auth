import { useHistory } from "react-router-dom";
import IdentityForm from "./IdentityForm";

export default function Register() {
  const history = useHistory();

  function handleSignUp(evt) {
    evt.preventDefault();
    console.log("signup click");
  }

  function handleRedirect(evt) {
    evt.preventDefault();
    history.push("/sign-in");
  }

  return (
    <>
      <IdentityForm
        header="Регистрация"
        buttonName="Зарегистрироваться"
        onClick={handleSignUp}
        askSignIn={
          <p className="identity__signin-ask">
            Уже зарегистрированы?{" "}
            <a
              className="identity__signin-link"
              href="./sign-in"
              onClick={handleRedirect}>
              Войти
            </a>
          </p>
        }
      />
    </>
  );
}
