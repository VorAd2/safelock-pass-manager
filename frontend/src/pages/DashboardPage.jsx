import { useEffect, useState } from "react";
import {Sidebar, DashboardHeader, Notification } from "../components";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
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

function DashboardPage({username}) {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    variant: '',
  });
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoading, setLoading] = useState(true);
 
  const { setAllVaults } = useVaults();
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
    console.log(`username: ${username}`)
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
        setAllVaults(response.data);
        console.log("Vaults carregados:", response.data);
        setLoading(false);
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
        } else if (err.response && err.response.status === 404) {
          console.log("Nenhum vault encontrado para este usuário.");
          setAllVaults([]);
          return
        } else {
          alert("Ocorreu um erro ao carregar os dados do cofre.");
        }
      }
    };

    fetchVaults();
  }, [username]);

  if (isLoading) {
    return <h1>Carregando...</h1>;
  }

  const currentPathSegment = location.pathname.split("/").pop();
  const headerTitle = currentPathSegment === username 
  ? username
  : titlesMap[currentPathSegment];



  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
        <DashboardHeader title={headerTitle} username={username} />
        <div className="flex-grow-1 d-flex" style={{ minHeight: 0 }}>
          <Outlet context={{ username, notificationHandler }} />
        </div>
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
