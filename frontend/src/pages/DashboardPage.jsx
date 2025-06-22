import { useEffect, useState } from "react";
import { Sidebar } from "../components";
import { DashboardHeader } from "../components";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
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
  const { username } = useParams();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

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
  const headerTitle = titlesMap[currentPathSegment];
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
    <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

    <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
      <DashboardHeader title={headerTitle} username={username} />
      
      <div className="flex-grow-1 d-flex" style={{ minHeight: 0 }}>
        <Outlet username={username}/>
      </div>
    </div>
  </div>
  );
}

export default DashboardPage;
