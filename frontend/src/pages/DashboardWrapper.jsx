import { VaultsProvider } from "../components/context/VaultsContext"
import DashboardPage from "./DashboardPage"
import { useParams } from "react-router-dom";

const DashboardWrapper = () => {
    const { username } = useParams();
    return (
        <VaultsProvider>
            <DashboardPage username={username}/>
        </VaultsProvider>
    )
}

export default DashboardWrapper