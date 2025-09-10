import { useTranslation } from 'react-i18next';
import type { ValidErrorType } from '~/shared/types';
import { Input as HerouiInput, type InputProps } from '@heroui/react';
import { useMemo } from 'react';

const Input = (props: InputProps & { error: ValidErrorType }) => {
  const { t } = useTranslation();
  const errorMessage = useMemo(() => {
    if (Array.isArray(props.error)) {
      return `${t(props.error[0], props.error[1])}`;
    }
    return props.error && t(props.error);
  }, [props.error, t]);
  return <HerouiInput {...props} isInvalid={!!props.error} errorMessage={errorMessage} />;
};

export default Input;

