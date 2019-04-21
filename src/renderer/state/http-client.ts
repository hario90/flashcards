import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";

class HttpClient {
    private static addAuthHeader(config: AxiosRequestConfig = {}): AxiosRequestConfig {
        try {
            const jwt = localStorage.getItem("jwt");
            return {
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${jwt}`,
                },
            };
        } catch (e) {
            return config;
        }
    }

    constructor() {
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
    }

    public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = HttpClient.addAuthHeader(config);
        return axios.get(url, config);
    }

    public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
        config = HttpClient.addAuthHeader(config);
        return axios.post(url, data, config);
    }

    public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
        config = HttpClient.addAuthHeader(config);
        return axios.put(url, data, config);
    }
}

export { HttpClient };
