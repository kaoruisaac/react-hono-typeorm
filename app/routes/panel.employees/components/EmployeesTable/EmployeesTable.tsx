import { Styled } from "remix-component-css-loader";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from "@heroui/react";
import JsonEmployee from "~/JsonModels/JsonEmployee";
import { useNavigate } from "react-router";

const EmployeesTable = ({ data }: { data: JsonEmployee[] }) => {
  const navigate = useNavigate();
  return (
    <Styled>
      <Table aria-label="員工列表" className="min-h-[400px]">
        <TableHeader>
          <TableColumn>姓名</TableColumn>
          <TableColumn>電子郵件</TableColumn>
          <TableColumn>角色</TableColumn>
          <TableColumn>操作</TableColumn>
        </TableHeader>
        <TableBody emptyContent="沒有資料">
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
                    編輯
                  </Button>
                  <Button
                    size="sm"
                    variant="bordered"
                    color="danger"
                    onPress={() => {
                    }}
                  >
                    刪除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Styled>
  )
}

export default EmployeesTable;