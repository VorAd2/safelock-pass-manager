import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { socket, registerSocket } from '../socket'
import { Sidebar, DashboardHeader, Notification } from "../components";
import axios from "axios";
import backCodes from "../back_codes";
import { useVaults } from "../components/context/useVaults";

const backUrl = import.meta.env.VITE_BACKEND_URL;
const titlesMap = {
  vaults: "Vaults",
  tools: "Explore Our Tools",
  send: "Share Your Credentials",
  cards: "Personal Cards",
  receipts: "Receipts",
  settings: "Settings",
  contactus: "Contact Us",
};


function DashboardPage({ username }) {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    variant: '',
  })
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [isLoading, setLoading] = useState(true)

  const { setAllVaults } = useVaults()
  const location = useLocation()
  const navigate = useNavigate()

  const handleStorageChange = (event) => {
    if (event.key === "authToken") {
      if (!event.newValue) {
        alert('Token removed. Redirecting...')
        navigate('/signin')
      } else {
        alert('New authentication detected. Redirecting...')
        navigate('/signin')
      }
    }
  }

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  }

  const notificationHandler = (show, message, variant) => {
    setNotification({ show: show, message: message, variant: variant })
    setTimeout(() => {
      setNotification({ show: false, message: '', variant: '' })
    }, 3500)
  }

  const fetchVaults = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.warn("Nenhum token encontrado. Redirecionando para login.");
      navigate("/signin");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(backUrl + "/dashboard/" + username, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      response.status === 200 && setAllVaults(response.data)
      setLoading(false);
      registerSocket(username)
    } catch (err) {
      setLoading(false);
      if (err.response) {
        const code = err.response.data?.code
        const message = err.response.data?.message
        if (code === backCodes.ACCESS_DENIED) {
          alert(message)
          localStorage.removeItem("authToken")
          navigate("/signin")
        } else if (err.response.status === 204) {
          setAllVaults([])
        } else {
          alert(backCodes.GENERIC_ERROR_FEEDBACK)
          console.warn('Erro na presença de response:', err.response)
        }
      } else if (err.request) {
        alert(backCodes.RESPONSE_ERROR_FEEDBACK)
        console.warn('Erro na presença de request:', err.request)
      } else {
        alert(backCodes.GENERIC_ERROR_FEEDBACK)
        console.warn('Erro inesperado:', err.message)
      }
    }
  };

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange)
    fetchVaults();
    return () => {
      socket.off('vaultShared')
      socket.off('vaultDeleted')
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [username])

  if (isLoading) {
    return <h1>Carregando...</h1>;
  }

  const currentPathSegment = location.pathname.split("/").pop();
  const headerTitle = currentPathSegment === username
    ? 'Dashboard'
    : titlesMap[currentPathSegment];



  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      <div className="d-flex flex-column flex-grow-1" style={{ minHeight: 0 }}>
        <DashboardHeader title={headerTitle} username={username} />
        <Outlet context={{ username, notificationHandler }} />
      </div>

      <Notification
        show={notification.show}
        message={notification.message}
        variant={notification.variant}
      />
    </div>
  )
}

export default DashboardPage;
