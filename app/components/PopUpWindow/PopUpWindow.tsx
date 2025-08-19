import { Button } from "@heroui/button";
import { Styled } from 'remix-component-css-loader';
import { RiCloseCircleLine } from "@remixicon/react";
import { useEffect, useRef } from "react";
import { forwardPopup } from "~/containers/PopUp/PopUpProvider";

const PopUpWindow = forwardPopup(({
  children,
  header,
}: {
  children: React.ReactNode,
  PopUp,
  header,
}, PopUp) => {
  const headerRef = useRef(null);
  useEffect(() => {
    const header = headerRef.current;
    if (header) {
      PopUp.setDraggable(header);
    }
  }, [PopUp]);
  return (
    <Styled>
      <div className="header" ref={headerRef}>
        <h3>{header}</h3>
        <Button isIconOnly radius="full" variant="light" onClick={() => PopUp.close()}>
          <RiCloseCircleLine />
        </Button>
      </div>
      <div className="content">
        {children}
      </div>
    </Styled>
  );
});

export default PopUpWindow;