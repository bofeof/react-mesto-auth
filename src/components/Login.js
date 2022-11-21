import IdentityForm from "./IdentityForm";

export default function Login() {
  function handleSignIn(evt) {
    evt.preventDefault();
    console.log("signin click");
  }

  return (
    <IdentityForm
      header="Вход"
      buttonName="Войти"
      onClick={handleSignIn}
      askSignIn={<p className="identity__signin-ask"></p>}
    />
  );
}
