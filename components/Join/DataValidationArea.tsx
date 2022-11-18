import { className } from "pages/user/join"
import { FieldError, ValidateResult } from "react-hook-form"

export interface IDataValidationArea {
    error: (FieldError | undefined),
    validationCheck: ValidateResult | FieldError | boolean | undefined,
    noValue: boolean,
    message: string
}
export default ({ fieldErrors }: { fieldErrors: IDataValidationArea[] }) => {
    return (
        <div className={className.DATA_VALIDATION_AREA}>
            {fieldErrors?.map((fieldError, i) => <span key={i} className={`${(fieldError.validationCheck || fieldError.noValue) ? 'text-red-500' : 'text-green-500'}`}>{fieldError.message}</span>)}
        </div>
    )
}