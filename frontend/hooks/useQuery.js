import { useEffect, useState } from 'react'

export default function useQuery(url, query) {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingRefetch, setLoadingRefetch] = useState(false)

    async function refetch(query) {
        setLoadingRefetch(true)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoadingRefetch(false)
            })
            .catch((err) => {
                setError(err)
                setLoadingRefetch(false)
            })
    }

    useEffect(() => {
        setLoading(true)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err)
                setLoading(false)
            })
    }, [])

    return { error, loading, data, refetch, loadingRefetch }
}
