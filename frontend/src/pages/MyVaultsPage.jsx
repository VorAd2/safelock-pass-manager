import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const backUrl = import.meta.env.VITE_BACKEND_URL;

function MyVaultsPage() {
    const { name } = useParams();
    const {isLoading, setLoading} = useState(true);

    useEffect(() => {
        axios.get(backUrl + '/myvaults/' + name)
            .then(response => {
                setLoading(false)
                console.log('Resposta do back: ' + response.data)
            })
            .catch(err => {
                alert(err)
            })
    }, [])

    if (isLoading) {
        return <h1>Carregando...</h1>
    }

    return (
        <>
            <h1>Cofres de {name}</h1>
        </>
    )
}

export default MyVaultsPage;