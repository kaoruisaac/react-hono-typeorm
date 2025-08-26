import { Styled } from 'remix-component-css-loader';
import http from '~/services/httpClient/http';
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
    SubmitButton,
    form: {
      hashId,
      name,
      email,
      roles,
      isActive,
    },
  } = useDataFlow({
    form: employee,
    onSubmit: async (data) => {
      if (mode == PAGE_MODE.MODE_CREATE) {
        const { name, email, roles, isActive } = data;
        await http.panel.employees.createEmployee({ name, email, roles, isActive });
      } else {
        const { name, email, roles, isActive } = data;
        await http.panel.employees.updateEmployee(hashId, { name, email, roles, isActive });
      }
    },
  });
  
  return (
    <Styled className="p-4">
      <LoadingMask>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            {
              mode != PAGE_MODE.MODE_VIEW
                ? <Input label={t('name')} value={name} onChange={(e) => changeForm({ name: e.target.value})} />
                : <span>{name}</span>
            }
          </div>
          <div>
            {
              mode != PAGE_MODE.MODE_VIEW
                ? <Input label={t('email')} value={email} onChange={(e) => changeForm({ email: e.target.value})} />
                : <span>{email}</span>
            }
          </div>
          <div>
            {
              mode != PAGE_MODE.MODE_VIEW
                ? <Select
                  label={t('roles')}
                  defaultSelectedKeys={roles}
                  selectionMode="multiple"
                  onChange={(e) => changeForm({ roles: e.target.value.split(',')})}
                >
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
          <div>
            {
              mode != PAGE_MODE.MODE_VIEW
                ? <Select
                  label={t('isActive')}
                  defaultSelectedKeys={typeof isActive === 'boolean' ? [isActive.toString()] : []}
                  onChange={(e) => changeForm({ isActive: e.target.value ? JSON.parse(e.target.value) : null })}
                >
                  <SelectItem key="true">{t('active')}</SelectItem>
                  <SelectItem key="false">{t('inactive')}</SelectItem>
                </Select>
                : <span>{isActive ? t('active') : t('inactive')}</span>
            }
          </div>
        </div>
        <SubmitButton />
      </LoadingMask>
    </Styled>
  );
};

export default EmployeesDetailPage;