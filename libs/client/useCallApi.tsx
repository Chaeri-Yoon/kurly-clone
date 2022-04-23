import { useState } from "react"

interface ICallApiArgs {
    url: string;
    method: string;
}
interface ICallApiState {
    loading: boolean;
    data?: { ok: boolean, [key: string]: any };
    error?: object;
}

export default function ({ url, method }: ICallApiArgs): [(data?: any) => void, ICallApiState] {
    const [state, setState] = useState<ICallApiState>({
        loading: false,
        data: undefined,
        error: undefined
    })

    function callApi(_data?: any) {
        fetch(url, {
            method,
            body: JSON.stringify(_data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
            .then(data => setState(prev => ({ ...prev, data })))
            .catch(error => setState(prev => ({ ...prev, error }))).finally(() => setState(prev => ({ ...prev, loading: false })));
    }
    return [callApi, { ...state }]
}