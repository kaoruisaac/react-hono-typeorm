import { Styled } from 'remix-component-css-loader';
import classnames from "classnames";
import { Spinner } from '@heroui/spinner';

const LoadingMask = ({ isLoading, children }) => {
    return (
        <Styled className={classnames({ isLoading })}>
            {children}
            <div className="mask">
                <Spinner size="md" />
            </div>
        </Styled>
    )
};

export default LoadingMask;