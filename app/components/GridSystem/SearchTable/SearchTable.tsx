import { useNavigation } from 'react-router';
import { Styled } from 'remix-component-css-loader';
import { Table } from '~/components/GridSystem/heroui';
import LoadingMask from '../LoadingMask/LoadingMask';

const SearchTable = ({ children }: { children: any }) => {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== 'idle';
  return (
    <Styled>
      <LoadingMask isLoading={isNavigating}>
        <Table isHeaderSticky>
          {children}
        </Table>
      </LoadingMask>
    </Styled>
  );
};

export default SearchTable;
