import { ValidationError } from 'yup';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Button, type ButtonProps } from '@heroui/react';
import LoadingMask from '~/components/GridSystem/LoadingMask';
import NotifyPopUp, { NOTIFY_TYPE } from '~/components/NotifyPopUp';
import usePopUp from '~/containers/PopUp/usePopUp';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

type AnyObject<F extends Record<any, any>> = Partial<F> & {
  [key: string]: any;
  [key: number]: any;
  [key: symbol]: any;
};

type AddPrefix<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: string;
};


function useDataFlow<F> ({
  form: initForm = {},
  onMount,
  onSubmit = () => {},
  onError = () => {},
  allowDirectSubmit = false,
  useNotify = true,
}: {
  form?: AnyObject<F>,
  onMount?: () => Promise<F>,
  onSubmit?: (form?: AnyObject<F>, ...args: any[]) => Promise<any> | void,
  onError?: (valid?) => void,
  allowDirectSubmit?: boolean,
  useNotify?: boolean,
}) {
  const { t } = useTranslation();
  const { PopUpBox } = usePopUp();
  const [form, setForm] = useState<AnyObject<F>>(initForm);
  const [valid, setValid] = useState<AnyObject<AddPrefix<F, 'V'>>>({});
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (onMount) {
      (async () => {
        setIsLoading(true);
        const f = await onMount();
        setForm(f);
        setIsLoading(false);
      })();
    }
  }, [onMount]);

  const submit = useCallback(async (...args) => {
    setIsLoading(true);
    try {
      await onSubmit(form, ...args);
      setHasChanged(false);
      if (useNotify) {
        PopUpBox(NotifyPopUp, { message: t('success'), type: NOTIFY_TYPE.SUCCESS });
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const newValid = {};
        if (error?.inner?.length) {
          error.inner.forEach(({ path, message }) => newValid[`V${path}`] = message);
        } else if (error.path){
          newValid[`V${error.path}`] = error.message;
        } else {
          console.error({ error });
        }
        setValid({ ...valid, ...newValid });
        onError(newValid);
      } else {
        if (error.errorMessage) {
          console.log({ error });
          PopUpBox(NotifyPopUp, { message: error.errorMessage });
        } else {
          console.error({ error });
        }
      }
    }
    setIsLoading(false);
  }, [form, valid, onSubmit, onError, PopUpBox]);

  const clearValid = useCallback((obj?: AnyObject<F>) => {
    if (obj) {
      const newValid = { ...valid };
      Object.keys(obj).forEach((key) => delete newValid[`V${key}`] );
      setValid(newValid);
    } else {
      setValid({});
    }
  }, [valid]);

  const changeForm = useCallback((obj: AnyObject<F>) => {
    setForm({ ...form, ...obj });
    setHasChanged(true);
    clearValid(obj);
  }, [form, clearValid]);

  const cRef = useRef({
    clearValid, changeForm, hasChanged,
    submit, allowDirectSubmit, t, isLoading,
  });
  cRef.current.submit = submit;
  cRef.current.hasChanged = hasChanged;
  cRef.current.clearValid = clearValid;
  cRef.current.changeForm = changeForm;
  cRef.current.isLoading = isLoading;
  cRef.current.allowDirectSubmit = allowDirectSubmit;

  const SubmitButton = useCallback(({ className, disabled, ...props } = {} as ButtonProps) => (
    <Button
      {...props}
      isDisabled={(!cRef.current.hasChanged && !cRef.current.allowDirectSubmit) || disabled}
      className={classNames('SubmitButton', className)}
      onPress={() => cRef.current.submit()}
      variant="bordered"
    >
      {props?.children || t('submit')}
    </Button>
  ), []);

  const PageLoadingMask = useCallback((props) => <LoadingMask isLoading={cRef.current.isLoading} {...props} />, []);

  return {
    form,
    valid,
    clearValid: (obj?: AnyObject<F>) => cRef.current.clearValid(obj),
    changeForm: (obj: AnyObject<F>) => cRef.current.changeForm(obj),
    isLoading,
    submit: () => cRef.current.submit(),
    SubmitButton,
    hasChanged,
    setHasChanged,
    LoadingMask: PageLoadingMask,
  };
}

export default useDataFlow;
