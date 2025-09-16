import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Styled } from 'remix-component-css-loader';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import NotifyPopUp, { NOTIFY_TYPE } from '~/components/NotifyPopUp/NotifyPopUp';
import usePopUp from '~/containers/PopUp/usePopUp';
import http from '~/services/httpClient/http';
import useDataFlow from '~/flow/useDataFlow';
import queryString from 'query-string';
import { useEffect } from 'react';

const LoginPage = () => {
  const { PopUpBox } = usePopUp();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { search } = useLocation();
  const { expired } = queryString.parse(search);

  useEffect(() => {
    if (expired) {
      PopUpBox(NotifyPopUp, { message: t('credential-expired-please-login-again'), type: NOTIFY_TYPE.ERROR });
    }
  }, []);

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
    useNotify: false,
    onSubmit: async (data) => {
      await http.auth.login(data.email, data.password);
      navigate('/panel');
    },
  });

  return (
    <Styled>
      <div>
        <h1>{t('login')}</h1>
        <form onSubmit={(e) => { e.preventDefault(); submit();}}>
          <Input label={t('email')} value={email} type="email" color='primary' autoFocus onChange={(e) => changeForm({ email: e.target.value })} />
          <Input label={t('password')} value={password} type="password" color='primary' onChange={(e) => changeForm({ password: e.target.value })} />
          <Button type="submit">{t('login')}</Button>
        </form>
      </div>
    </Styled>
  );
};

export default LoginPage;