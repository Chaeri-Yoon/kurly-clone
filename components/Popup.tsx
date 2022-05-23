import ReactDOM from "react-dom";

const Popup = ({ children }: any) => {
    return ReactDOM.createPortal(
        <div>
            {children}
        </div>
        , document.getElementById('portal')!);
}
export default Popup;