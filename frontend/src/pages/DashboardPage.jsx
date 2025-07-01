import { useEffect, useState } from "react";
import {Sidebar, DashboardHeader, Notification } from "../components";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { VaultsProvider } from "../components/partials/dashboard/vaults_content/context/VaultsContext";
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

function DashboardPage() {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    variant: '',
  });
  const { username } = useParams();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const notificationHandler = (show, message, variant) => {
    setNotification({show: show, message: message, variant: variant})
    setTimeout(() => {
      setNotification({show: false, message:'', variant:''})
    }, 3500)
  }

  useEffect(() => {
    console.log("useEffect executado");
    const fetchVaults = async () => {
      console.log("fetchVaults executado");
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
        setLoading(false);
        console.log("Resposta do back:", response.data);
      } catch (err) {
        console.error("ERROR:", err);
        console.error(err.response);
        setLoading(false);
        if (err.response && err.response.status === 403) {
          alert(
            "Acesso negado ou sessão expirada. Por favor, faça login novamente."
          );
          localStorage.removeItem("authToken");
          navigate("/signin");
        } else {
          alert("Ocorreu um erro ao carregar os dados do cofre.");
        }
      }
    };

    fetchVaults();
  }, [username, navigate]);

  if (isLoading) {
    return <h1>Carregando...</h1>;
  }

  const currentPathSegment = location.pathname.split("/").pop();
  const headerTitle = currentPathSegment === username 
  ? username
  : titlesMap[currentPathSegment];

  function getContentWithProvider() {
    switch (headerTitle) {
      case "Vaults":
        return (
          <VaultsProvider>
            <Outlet context={{username, notificationHandler}} />
          </VaultsProvider>
        )
      case "Explore Our Tools":
        return <Outlet context={{username, notificationHandler}} />;
      case "Share Your Credentials":
        return <Outlet context={{username, notificationHandler}} />;
      case "Personal Cards":
        return <Outlet context={{username, notificationHandler}} />;
      case "Receipts":
        return <Outlet context={{username, notificationHandler}} />;
      case "Settings":
        return <Outlet context={{username, notificationHandler}} />;
      case "Contact Us":
        return <Outlet context={{username, notificationHandler}} />;
      case username:
        return <Outlet context={{username, notificationHandler}} />;
      default:
        return <h1>Content not found</h1>;
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
    <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

    <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
      <DashboardHeader title={headerTitle} username={username} />
      
      <div className="flex-grow-1 d-flex" style={{ minHeight: 0 }}>
        {getContentWithProvider()}
      </div>
    </div>
    <Notification 
        show={notification.show}
        message={notification.message}
        variant={notification.variant}
      />
  </div>
  
  );
}

export default DashboardPage;
