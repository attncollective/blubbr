import { useEffect, useState } from 'react'

export default function useFetch(url, apiKey) {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: apiKey },
        }

        fetch(url, options)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
            .catch((err) => setError(err))
    }, [])

    return { error, loading, data }
}
