import axios from 'axios'

const useAxios = () => {
    const baseURL = 'http://localhost:5000/api'

    const axiosPublic = axios.create({ baseURL })

    return {
        axiosPublic
    }
}

export default useAxios;