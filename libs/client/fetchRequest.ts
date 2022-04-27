interface IFetchRequest {
    url: string,
    method: string,
    data?: any
}
export default function ({ url, method, data }: IFetchRequest) {
    return fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
}