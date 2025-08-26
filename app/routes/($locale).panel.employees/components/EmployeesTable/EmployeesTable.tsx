import { Styled } from 'remix-component-css-loader';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from '@heroui/react';
import JsonEmployee from '~/JsonModels/JsonEmployee';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const EmployeesTable = ({ data }: { data: JsonEmployee[] }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Styled>
      <Table aria-label={t('employees-list')} className="min-h-[400px]">
        <TableHeader>
          <TableColumn>{t('name')}</TableColumn>
          <TableColumn>{t('email')}</TableColumn>
          <TableColumn>{t('roles')}</TableColumn>
          <TableColumn>{t('actions')}</TableColumn>
        </TableHeader>
        <TableBody emptyContent={t('no-data')}>
          {data.map((employee) => (
            <TableRow key={employee.hashId} className="table-row-hover">
              <TableCell className="font-medium">
                {employee.name}
              </TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {employee.roles.map((role) => (
                    <Chip
                      key={role}
                      size="sm"
                      color={role === 'admin' ? 'danger' : role === 'employee' ? 'primary' : 'default'}
                      variant="flat"
                    >
                      {role}
                    </Chip>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="bordered"
                    color="primary"
                    onPress={() => {
                      navigate(`./${employee.hashId}`);
                    }}
                  >
                    {t('edit')}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Styled>
  );
};

export default EmployeesTable;