import MainLayout from "../components/layout/MainLayout";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <MainLayout>
            <DashboardOverview />
        </MainLayout>
    );
};

export default Dashboard;