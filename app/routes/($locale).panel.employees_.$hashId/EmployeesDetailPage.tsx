import { Styled } from 'remix-component-css-loader';
import { Input, Accordion, AccordionItem, Select, SelectItem, Button } from '~/components/GridSystem/heroui';
import http from '~/services/httpClient/http';
import { useLoaderData, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PAGE_MODE, ROLE_OPTIONS } from '~/constants';
import type JsonEmployee from '~/JsonModels/JsonEmployee';
import useDataFlow from '~/flow/useDataFlow';
import validator from '~/shared/validator';
import { RiArrowLeftLine } from '@remixicon/react';

const EmployeesDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
      password,
    },
    valid: {
      Vname,
      Vemail,
      Vroles,
      VisActive,
      Vpassword,
    },
  } = useDataFlow({
    form: {
      ...employee,
      password: '',
    },
    onSubmit: async (data) => {
      const { name, email, roles, isActive, password } = data;
      const payload = { name, email, roles, isActive, password };
      if (mode == PAGE_MODE.MODE_CREATE) {
        validator.employee.create().validateSync(data, { abortEarly: false });
        await http.panel.employees.createEmployee(payload);
      } else {
        validator.employee.update().validateSync(data, { abortEarly: false });
        await http.panel.employees.updateEmployee(hashId, payload);
      }
    },
  });
  
  return (
    <Styled className="p-4">
      <LoadingMask>
        <Button variant="light" onPress={() => navigate(-1)}>
          <RiArrowLeftLine />
          {t('back-to-list')}
        </Button>
        <div className="mb-4 mt-4">
          <Accordion variant="shadow" selectionMode="multiple" defaultExpandedKeys={['1', '2']}>
            <AccordionItem key="1" title={t('basic-info')}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  {
                    mode != PAGE_MODE.MODE_VIEW
                      ? <Input error={Vname} label={t('name')} value={name} onChange={(e) => changeForm({ name: e.target.value})} />
                      : <span>{name}</span>
                  }
                </div>
                <div>
                  {
                    mode != PAGE_MODE.MODE_VIEW
                      ? <Input error={Vemail} label={t('email')} value={email} onChange={(e) => changeForm({ email: e.target.value})} />
                      : <span>{email}</span>
                  }
                </div>
                <div>
                  {
                    mode != PAGE_MODE.MODE_VIEW
                      ? <Select
                        label={t('roles')}
                        error={Vroles}
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
                        error={VisActive}
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
            </AccordionItem>
            {
              mode != PAGE_MODE.MODE_VIEW && (
                <AccordionItem key="2" title={mode === PAGE_MODE.MODE_CREATE ? t('password') : t('change-password')}>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Input error={Vpassword} label={t('new-password')} value={password} onChange={(e) => changeForm({ password: e.target.value})} />
                    </div>
                  </div>
                </AccordionItem>
              )
            }
          </Accordion>
        </div>
        <SubmitButton />
      </LoadingMask>
    </Styled>
  );
};

export default EmployeesDetailPage;