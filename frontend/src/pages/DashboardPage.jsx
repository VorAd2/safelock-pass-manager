import {useEffect, useState} from 'react';
import { Sidebar, MainContent } from '../components'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const backUrl = import.meta.env.VITE_BACKEND_URL;


function DashboardPage() {
    const { username } = useParams()
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isLoading, setLoading] = useState(true)
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    useEffect(() => {
        console.log('useEffect executado')
        const fetchVaults = async () => {
            console.log('fetchVaults executado')
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.warn('Nenhum token encontrado. Redirecionando para login.');
                navigate('/signin');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(backUrl + '/dashboard/' + username, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                setLoading(false);
                console.log('Resposta do back:', response.data);
            } catch (err) {
                console.error('ERROR:', err);
                console.error(err.response)
                setLoading(false); 
                if (err.response && err.response.status === 403) {
                    alert('Acesso negado ou sessão expirada. Por favor, faça login novamente.');
                    localStorage.removeItem('authToken'); 
                    navigate('/signin');
                } else {
                    alert('Ocorreu um erro ao carregar os dados do cofre.');
                }
            }
        };

    fetchVaults();
}, [username, navigate]);


    if (isLoading) {
        return <h1>Carregando...</h1>
    }
    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
            <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
            <MainContent isSidebarExpanded={isSidebarExpanded} />
        </div>
 
    )
}

export default DashboardPage;