import { Select as HerouiSelect, type SelectProps } from '@heroui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ValidErrorType } from '~/shared/types';

const Select = (props: SelectProps & { error: ValidErrorType }) => {
  const { t } = useTranslation();
  const errorMessage = useMemo(() => {
    if (Array.isArray(props.error)) {
      return `${t(props.error[0], props.error[1])}`;
    }
    return props.error && t(props.error);
  }, [props.error, t]);
  return <HerouiSelect {...props} isInvalid={!!props.error} errorMessage={errorMessage} />;
};

export default Select;
