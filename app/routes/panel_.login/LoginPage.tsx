import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Styled } from "remix-component-css-loader";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import http from "~/services/httpClient/http";
import useDataFlow from "~/flow/useDataFlow";

const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    submit,
    form: {
      email,
      password,
    },
    changeForm,
  } = useDataFlow({
    form: {
      email: '',
      password: '',
    },
    onSubmit: async (data) => {
      await http.auth.login(data.email, data.password);
      navigate("/panel");
    }
  });

  return (
    <Styled>
      <div>
        <h1>{t("login")}</h1>
        <form onSubmit={(e) => { e.preventDefault(); submit();}}>
          <Input label={t("email")} value={email} type="email" onChange={(e) => changeForm({ email: e.target.value })} />
          <Input label={t("password")} value={password} type="password" onChange={(e) => changeForm({ password: e.target.value })} />
          <Button type="submit">{t("login")}</Button>
        </form>
      </div>
    </Styled>
  )
}

export default LoginPage;