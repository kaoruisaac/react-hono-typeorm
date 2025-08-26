import { v4 as uuid } from 'uuid';
import EventEmitter from 'events';
import classnames from 'classnames';
import {
  createContext,
  Component,
  useState,
  useRef,
  useMemo,
  createRef,
  type ComponentType,
} from 'react';
import DraggableTracker from './DraggableTracker';

type PopUpTypeExtends<T> = {
    [K in keyof T as K extends 'PopUp' ? never : K]: T[K];
};
export class PopUp extends Component<any, any> {
  frameRef = createRef<HTMLDivElement>();
  layerRef = createRef<HTMLDivElement>();
  draggableTracker = null;

  state = {
    active: false,
  };
  listener = new EventEmitter();
  constructor(props) {
    super(props);
    const { onInit } = this.props;
    onInit(this);
  }

  componentDidMount(): void {
    setTimeout(() => this.setState({ active: true }), 10);
  }

  get controller() {
    const { controllerRef } = this.props;
    return controllerRef.current;
  }

  close(...args) {
    const { popupId } = this.props;
    this.setState({ active: false }, () => {
      this.listener.emit('close', ...args);
    });
    setTimeout(() => {
      this.controller.remove(popupId);
    }, 300);
  }

  onClose(callback) {
    this.listener.on('close', callback);
  }

  setDraggable(el) {
    el.onmousedown = (e) => this.startDragTracker(e);
  }

  startDragTracker(event) {
    const { current: layerEl } = this.layerRef;
    const { current: outerFrame } = this.frameRef;
    this.draggableTracker = this.draggableTracker || new DraggableTracker(outerFrame, layerEl);
    this.draggableTracker.track(event, ({ top, left }) => {
      outerFrame.style.top = `${top}px`;
      outerFrame.style.left = `${left}px`;
    });
  }

  render() {
    const { children, popupId } = this.props;
    const { active } = this.state;
    return (
      <div key={popupId} className={classnames('PopUpFrame', { active })} ref={this.layerRef}>
        <div className="bg" onClick={() => this.close()} />
        <div className="popupContent" ref={this.frameRef}>{children}</div>
      </div>
    );
  }
}

export class Modal<P> extends PopUp {
  override componentDidMount(): void {}
  open(props: P) {
    this.props.setChildrenProps(props);
    setTimeout(() => this.setState({ active: true }), 10);
  }
  override close(...args) {
    this.setState({ active: false }, () => {
      this.listener.emit('close', ...args);
    });
  }
  remove() {
    const { popupId } = this.props;
    const { active } = this.state;
    if (active) {
      this.close();
      setTimeout(() => {
        this.controller.remove(popupId);
      }, 300);
    } else {
      this.controller.remove(popupId);
    }
  }
}

type PopUpProps = {
    PopUpBox?: <T>(Component: ComponentType<T>, props?: PopUpTypeExtends<T>) => Promise<PopUp>;
    Modal?: <T, P>(Component: ComponentType<T>, props?: P) => Promise<Modal<P>>;
};

export const PopupContext = createContext({} as PopUpProps);

const popMap = new Map();
const PopUpProvider = ({ children }) => {
  const [, setUpdateCounter] = useState(0);
  const controllerRef = useRef({} as any);
  controllerRef.current = useMemo(() => ({
    remove: (id) => {
      setTimeout(() => {
        popMap.delete(id);
        setUpdateCounter(prev => prev + 1);
      }, 300);
    },
  }), []);
  return (
    <PopupContext.Provider value={{
      PopUpBox: (Component: any, props) => {
        return new Promise((r) => {
          const popupId = uuid();
          let instance: PopUp;
          const popup = (
            <PopUp key={popupId} {...{ popupId, controllerRef, onInit: (context) => { instance = context; r(instance); } }}>
              <Component
                {...props}
                PopUp={{
                  close: () => instance.close(),
                  setDraggable: (el) => instance.setDraggable(el),
                }}
              />
            </PopUp>
          );
          popMap.set(popupId, popup);
          setUpdateCounter(prev => prev + 1);
        });
      },
      Modal <P>(Component: any, props: P) {
        return new Promise<Modal<P>>((r) => {
          const popupId = uuid();
          let instance;
          const ModalFrame = () => {
            const [childrenProps, setChildrenProps] = useState({});
            return (
              <Modal key={popupId} {...{ popupId, controllerRef, onInit: (context) => { instance = context; r(instance); }, setChildrenProps }}>
                <Component
                  PopUp={{
                    close: () => instance.close(),
                    setDraggable: (el) => instance.setDraggable(el),
                  }}
                  {...props}
                  {...childrenProps}
                />
              </Modal>
            );
          };
          popMap.set(popupId, <ModalFrame />);
          setUpdateCounter(prev => prev + 1);
        });
      },
    }}>
      {children}
      <div className="PopUpMain">
        {[...popMap.values()]}
      </div>
    </PopupContext.Provider>
  );
};
export function forwardPopup<T>(ComponentWithPopUp: (props: T, popup: PopUp) => React.ReactNode) {
  return (props: T) => ComponentWithPopUp(props, (props as any).PopUp);
}

export default PopUpProvider;
