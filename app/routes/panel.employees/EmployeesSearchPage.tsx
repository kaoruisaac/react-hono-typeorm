import { useTranslation } from "react-i18next";
import { Styled } from "remix-component-css-loader";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Input,
  Select,
  SelectItem
} from "@heroui/react";
import useLoaderSearchFlow from "~/flow/useLoaderSearchFlow";
import JsonEmployee from "~/JsonModels/JsonEmployee";
import useDataFlow from "~/flow/useDataFlow";
import EmployeesTable from "./components/EmployeesTable/EmployeesTable";
import { ROLE_OPTIONS } from "~/constants";

export interface SearchParams {
  name: string;
  email: string;
  roles: string;
}


const EmployeesSearchPage = () => {
  const { t } = useTranslation();

  const {
    form: {
      name,
      email,
      roles,
    },
    valid: {
      Vname,
      Vemail,
      Vroles
    },
    changeForm,
  } = useDataFlow({
    form: {
      name: "",
      email: "",
      roles: ""
    },
  })
  
  const {
    data,
    SearchButton,
    SearchPageNav,
    CreateButton,
    SearchQueryBlock,
    SearchResultBlock,
  } = useLoaderSearchFlow<JsonEmployee, SearchParams>({
    onSearch: () => {
      return {
        name: name,
        email: email,
        roles: roles
      }
    }
  });

  return (
    <Styled>
      <div className="p-6 space-y-6 employees-search-page">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("employees")}
          </h1>
          <CreateButton />
        </div>

        {/* 查詢條件區塊 */}
        <SearchQueryBlock>
          <Card className="shadow-sm search-card">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                查詢條件
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="姓名"
                  value={name}
                  errorMessage={Vname}
                  onChange={(e) => changeForm({ name: e.target.value })}
                />
                <Input
                  label="電子郵件"
                  value={email}
                  errorMessage={Vemail}
                  onChange={(e) => changeForm({ email: e.target.value })}
                />
                <Select
                  label="角色"
                  errorMessage={Vroles}
                  selectedKeys={roles ? [roles] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    changeForm({ roles: selectedKey || "" });
                  }}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2 mt-4">
                <SearchButton />
              </div>
            </CardBody>
          </Card>
        </SearchQueryBlock>

        {/* 查詢結果清單 */}
        <SearchResultBlock>
          <Card className="shadow-sm search-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  查詢結果
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              <EmployeesTable data={data} />
              <SearchPageNav />
            </CardBody>
          </Card>
        </SearchResultBlock>
      </div>
    </Styled>
  );
}

export default EmployeesSearchPage;