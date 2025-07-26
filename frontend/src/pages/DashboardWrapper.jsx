import { useParams } from "react-router-dom";
import { VaultsProvider } from "../components/context/VaultsContext"
import DashboardPage from "./DashboardPage"


const DashboardWrapper = () => {
    const { username } = useParams();
    return (
        <VaultsProvider>
            <DashboardPage username={username}/>
        </VaultsProvider>
    )
}

export default DashboardWrapper