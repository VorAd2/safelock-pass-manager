import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

function SettingsContent() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('authToken')
        navigate('/')
    }
    return (
        <div className="p-3">
            <Button variant='outline-warning' size="lg" onClick={handleLogout}>
                Log out
            </Button>
        </div>
    )
}

export default SettingsContent