import { useContext } from 'react';
import { PopupContext } from './PopUpProvider';
const usePopUp = () => useContext(PopupContext);
export default usePopUp;