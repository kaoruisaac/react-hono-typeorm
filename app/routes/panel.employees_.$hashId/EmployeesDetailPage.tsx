import { Styled } from 'remix-component-css-loader'
import { useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Input, Select, SelectItem } from '@heroui/react';
import { PAGE_MODE, ROLE_OPTIONS } from '~/constants';
import type JsonEmployee from '~/JsonModels/JsonEmployee';
import useDataFlow from '~/flow/useDataFlow';

const EmployeesDetailPage = () => {
  const { t } = useTranslation();
  const { mode, employee } = useLoaderData<{ mode: PAGE_MODE, employee: JsonEmployee }>();
  const {
    LoadingMask,
    changeForm,
    form: {
      hashId,
      name,
      email,
      roles,
    },
  } = useDataFlow({
    form: employee,
    onSubmit: async (data) => {
      console.log(data);
    }
  })
  
  return (
    <Styled>
      <LoadingMask>
        <div>
          {
            mode != PAGE_MODE.MODE_VIEW
              ? <Input label={t('name')} value={name} onChange={(e) => changeForm({ name: e.target.value})} />
              : <span>{name}</span>
          }
          {
            mode != PAGE_MODE.MODE_VIEW
              ? <Input label={t('email')} value={email} onChange={(e) => changeForm({ email: e.target.value})} />
              : <span>{email}</span>
          }
          
          {
            mode != PAGE_MODE.MODE_VIEW
              ? <Select label={t('roles')} value={roles} onChange={(e) => changeForm({ roles: [e.target.value]})}>
                  {
                    ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.value}>
                        {role.label}
                      </SelectItem>
                    ))
                  }
                </Select>
              : <span>{roles.join(', ')}</span>
          }
        </div>
      </LoadingMask>
    </Styled>
  );
};

export default EmployeesDetailPage;