import { useTranslation } from 'react-i18next';
import { Styled } from 'remix-component-css-loader';
import { 
  Input,
  Select,
  SelectItem,
} from '~/components/GridSystem/heroui';
import useLoaderSearchFlow from '~/flow/useLoaderSearchFlow';
import JsonEmployee from '~/JsonModels/JsonEmployee';
import useDataFlow from '~/flow/useDataFlow';
import EmployeesTable from './components/EmployeesTable';
import { ROLE_OPTIONS } from '~/constants';

export interface SearchParams {
  name: string;
  email: string;
  roles: string;
  isActive: boolean;
}


const EmployeesSearchPage = () => {
  const { t } = useTranslation();

  const {
    form: {
      name,
      email,
      roles,
      isActive,
    },
    valid: {
      Vname,
      Vemail,
      Vroles,
      VisActive,
    },
    changeForm,
  } = useDataFlow({
    form: {
      name: '',
      email: '',
      roles: '',
      isActive: true,
    },
  });
  
  const {
    data,
    SearchPageNav,
    CreateButton,
    SearchQueryBlock,
    SearchResultBlock,
  } = useLoaderSearchFlow<JsonEmployee, SearchParams>({
    onSearch: () => {
      return {
        name,
        email,
        roles,
        isActive,
      };
    },
  });

  return (
    <Styled>
      <div className="p-6 space-y-6 employees-search-page">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('employees')}
          </h1>
          <CreateButton />
        </div>

        {/* 查詢條件區塊 */}
        <SearchQueryBlock>
          <Input
            label={t('name')}
            value={name}
            error={Vname}
            onChange={(e) => changeForm({ name: e.target.value })}
          />
          <Input
            label={t('email')}
            value={email}
            error={Vemail}
            onChange={(e) => changeForm({ email: e.target.value })}
          />
          <Select
            label={t('roles')}
            error={Vroles}
            selectedKeys={roles ? [roles] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              changeForm({ roles: selectedKey || '' });
            }}
          >
            {ROLE_OPTIONS.map((role) => (
              <SelectItem key={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            label={t('is-active')}
            error={VisActive}
            selectedKeys={isActive !== null ? [isActive.toString()] : []}
            onChange={(e) => {
              changeForm({ isActive: e.target.value ? JSON.parse(e.target.value) : null });
            }}
          >
            <SelectItem key="true">{t('active')}</SelectItem>
            <SelectItem key="false">{t('inactive')}</SelectItem>
          </Select>
        </SearchQueryBlock>
        {/* 查詢結果清單 */}
        <SearchResultBlock>
          <EmployeesTable data={data} />
          <SearchPageNav />
        </SearchResultBlock>
      </div>
    </Styled>
  );
};

export default EmployeesSearchPage;