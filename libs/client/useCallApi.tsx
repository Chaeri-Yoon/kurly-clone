import { useState } from "react"

interface ICallApiArgs {
    url: string;
    method: string;
    data?: any
}
interface IDataResponse {
    [key: string]: any,
    ok: boolean
}
interface IActionDataState {
    loading?: boolean;
    data?: IDataResponse;
    error?: object;
}

export function actionDataRequest({ url, method }: ICallApiArgs): [(data?: any) => void, IActionDataState] {
    const [state, setState] = useState<IActionDataState>({
        loading: false,
        data: undefined,
        error: undefined
    })

    function callApi(_data?: any) {
        fetchData({ url, method, data: _data })
            .then(response => response.json())
            .then(data => setState(prev => ({ ...prev, data })))
            .catch(error => setState(prev => ({ ...prev, error }))).finally(() => setState(prev => ({ ...prev, loading: false })));
    }
    return [callApi, { ...state }]
}

export function loadDataRequest({ url, method, data }: ICallApiArgs) {
    return fetchData({ url, method, data }).then(response => response.json());
}

function fetchData({ url, method, data }: ICallApiArgs): Promise<Response> {
    return fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
}