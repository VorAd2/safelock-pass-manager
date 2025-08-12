import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { socket, registerSocket } from '../socket'
import {Sidebar, DashboardHeader, Notification } from "../components";

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
      console.error("ERROR:", err)
      console.error(err.response)
      setLoading(false);
      if (err.response && err.response.data.code === backCodes.ACCESS_DENIED) {
        alert(
          "Access denied or session expired. Please, log in again."
        )
        localStorage.removeItem("authToken")
        navigate("/signin");
      } else if (err.response && err.response.status === 204) {
        console.log("Nenhum vault encontrado para este usuário.")
        setAllVaults([])
      } else {
        alert("Ocorreu um erro ao carregar os dados do cofre.")
      }
    }
  };

  useEffect(() => {
    fetchVaults();
    return () => {
      socket.off('vaultShared')
      socket.off('vaultDeleted')
    }
  }, [username]);

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
