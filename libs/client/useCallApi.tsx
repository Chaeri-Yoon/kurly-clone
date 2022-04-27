import { useState } from "react"
import fetchRequest from "./fetchRequest";

interface ICallApiArgs {
    url: string;
    method: string;
}
interface IDataResponse {
    [key: string]: any,
    ok: boolean
}
interface ICallApiState {
    loading?: boolean;
    data?: IDataResponse;
    error?: object;
}

export default function ({ url, method }: ICallApiArgs): [(data?: any) => void, ICallApiState] {
    const [state, setState] = useState<ICallApiState>({
        loading: false,
        data: undefined,
        error: undefined
    })

    function callApi(_data?: any) {
        fetchRequest({ url, method, data: _data })
            .then(response => response.json())
            .then(data => setState(prev => ({ ...prev, data })))
            .catch(error => setState(prev => ({ ...prev, error }))).finally(() => setState(prev => ({ ...prev, loading: false })));
    }
    return [callApi, { ...state }]
}