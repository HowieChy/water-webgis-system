import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import UserParams from '../pages/admin/UserParams'; // Placeholder generic
import FacilityMgr from '../pages/admin/FacilityMgr';
import LogAudit from '../pages/admin/LogAudit';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <Dashboard />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'admin/users',
                element: <UserParams />, // To be implemented
            },
            {
                path: 'admin/facilities',
                element: <FacilityMgr />,
            },
            {
                path: 'admin/logs',
                element: <LogAudit />,
            }
        ]
    }
]);

export default router;
