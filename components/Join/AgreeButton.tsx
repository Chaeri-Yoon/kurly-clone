import { faCircle, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IForm } from 'pages/user/join';
import { useMemo, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface IAgreeButton {
    id: string,
    required: boolean,
    agree_allChecked: boolean,
    setFormValue: UseFormSetValue<IForm>,
    [key: string]: any
}

export default (props: IAgreeButton) => {
    const { id, required, agree_allChecked, setFormValue, ...rest } = props;
    const [isChecked, setIsChecked] = useState(false);
    const handleChecked = () => setIsChecked(prev => !prev);
    useMemo(() => setFormValue(id, isChecked), [isChecked]);
    useMemo(() => { if (required) setIsChecked(agree_allChecked) }, [agree_allChecked]);
    return (
        <>
            <input type='checkbox' id={id} onClick={handleChecked} {...rest.register} className='mr-3 relative text-2xl' />
            <label htmlFor={id} className='absolute bg-white'>
                <FontAwesomeIcon icon={isChecked ? faCircleCheck : faCircle} className='' />
            </label>
        </>
    )
}