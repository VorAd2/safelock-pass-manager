import { useRef, useState } from "react";
import { Overlay, Popover, Button } from "react-bootstrap"; // Adjust the import path as necessary
import styles from "../../styles/MiniModal.module.css";

function MiniModal({
    children,
    ButtonIcon,
    buttonClass,
    iconClass,
    placement = "bottom-start",
    className = ""
}) {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const popoverItemClass = styles.item
    const togglePopover = (e) => {
        setShow(!show)
        e.stopPropagation()
    }
    const closePopover = (e) => {
        setShow(false)
        e.stopPropagation()
    };

    return (
    <>
        <div
        ref={target}
        onClick={togglePopover} 
        className={`${buttonClass}`} 
        style={{ cursor: "pointer" }}
        >
            {ButtonIcon ? <ButtonIcon className={iconClass} /> : "⋮"}
        </div>

        <Overlay
        target={target.current}
        show={show}
        placement={placement}
        rootClose
        onHide={closePopover}
        >
            <Popover className={`${styles.popover} ${className}`}>
                <Popover.Body className={styles.popoverBody}>
                {typeof children === "function" ? children({ closePopover, popoverItemClass }) : children}
                </Popover.Body>
            </Popover>
        </Overlay>
    </>
    );
}

export default MiniModal;