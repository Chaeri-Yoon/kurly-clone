import { useState } from "react"

interface ICallApiArgs {
    url: string;
    method?: string;
    data?: any
}
interface IMutateState<T> {
    loading: boolean;
    data: T;
    error?: string;
}
export interface IDataResponse {
    ok: boolean
}

export function mutateData<T extends IDataResponse, S>({ url, method }: ICallApiArgs): [(data?: any) => void, IMutateState<T>] {
    const [state, setState] = useState<IMutateState<T>>({
        loading: false,
        data: {} as T,
        error: undefined
    })

    function callApi(_data?: S) {
        fetchData({ url, method, data: _data })
            .then(response => response.json())
            .then(data => setState(prev => ({ ...prev, data })))
            .catch(error => setState(prev => ({ ...prev, error }))).finally(() => setState(prev => ({ ...prev, loading: false })));
    }
    return [callApi, { ...state }]
}

export function loadData<T extends IDataResponse>({ url }: ICallApiArgs): Promise<T> {
    return fetchData({ url, method: 'GET' }).then(response => response.json());
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