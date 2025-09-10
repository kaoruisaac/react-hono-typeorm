import { Styled } from 'remix-component-css-loader';
import { Table } from '~/components/GridSystem/heroui';

const SearchTable = ({ children }: { children: any }) => {
  return (
    <Styled>
      <Table isHeaderSticky>
        {children}
      </Table>
    </Styled>
  );
};

export default SearchTable;
