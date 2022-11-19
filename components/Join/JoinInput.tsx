import { className } from "pages/user/join";
import { useEffect, useState } from "react";
import DataValidationArea, { IDataValidationArea } from "./DataValidationArea";

interface IJoinInput {
    label: string,
    required: boolean,
    validations?: IDataValidationArea[],
    sub_child?: JSX.Element,
}

export default ({ children, input }: { children: JSX.Element, input: IJoinInput }) => {
    const [startValidate, setStartValidate] = useState(false);
    const openValidationArea = input.validations && <DataValidationArea fieldErrors={[...input.validations]} />
    const handleStartValidate = () => setStartValidate(true);
    return (
        <>
            <div className={`${className.ROW}`}>
                <span className={`${className.LABEL}`}>{input.label}{className.REQUIRED && <span className={`${className.REQUIRED}`}>*</span>}</span>
                <div className={`${className.DATA_AREA} w-full`}>
                    <div onClick={handleStartValidate} className={`${className.INPUT_CONTAINER}`}>
                        {children}
                    </div>
                </div>
                {input.sub_child}
            </div>
            {startValidate && openValidationArea}
        </>
    )
}