import React, { Dispatch, SetStateAction, useState } from "react";
import ReactDOM from "react-dom";

const Popup = ({ children, setPopupOpen }: { children: any, setPopupOpen: Dispatch<SetStateAction<boolean>> }) => {
    return ReactDOM.createPortal(
        <div className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-kurly-black/[.9] z-[99]`} onClick={() => setPopupOpen(false)}>
            <div className="w-1/3 opacity-100 z-[100]" onClick={event => event.stopPropagation()}>
                {children}
            </div>
        </div>
        , document.getElementById('portal')!);
}
export default Popup;