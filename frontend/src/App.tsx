import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "@/pages/user/Welcome";
import Login from "@/pages/user/Login";
import Home from "@/pages/user/Home";
import TaskList from "@/pages/user/TaskList";
import TaskDetail from "@/pages/user/TaskDetail";
import Recording from "@/pages/user/Recording";
import MyOrders from "@/pages/user/MyOrders";
import Learning from "@/pages/user/Learning";
import Wallet from "@/pages/user/Wallet";
import Help from "@/pages/user/Help";
import Notifications from "@/pages/user/Notifications";
import Profile from "@/pages/user/Profile";

import ClientLogin from "@/pages/client/ClientLogin";
import ClientHome from "@/pages/client/ClientHome";
import PublishDemand from "@/pages/client/PublishDemand";
import ClientOrders from "@/pages/client/ClientOrders";
import ReviewWork from "@/pages/client/ReviewWork";
import VoiceActors from "@/pages/client/VoiceActors";
import ClientProfile from "@/pages/client/ClientProfile";
import Expenses from "@/pages/client/Expenses";

import AdminLogin from "@/pages/admin/AdminLogin";
import Dashboard from "@/pages/admin/Dashboard";
import UserManagement from "@/pages/admin/UserManagement";
import ManuscriptProcessing from "@/pages/admin/ManuscriptProcessing";
import OrderDispatch from "@/pages/admin/OrderDispatch";
import QualityReview from "@/pages/admin/QualityReview";
import CounselorManagement from "@/pages/admin/CounselorManagement";
import OrganizationManagement from "@/pages/admin/OrganizationManagement";
import FinancialSettlement from "@/pages/admin/FinancialSettlement";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/home" element={<Home />} />
        <Route path="/user/tasks" element={<TaskList />} />
        <Route path="/user/task/:id" element={<TaskDetail />} />
        <Route path="/user/recording/:orderId" element={<Recording />} />
        <Route path="/user/orders" element={<MyOrders />} />
        <Route path="/user/learning" element={<Learning />} />
        <Route path="/user/wallet" element={<Wallet />} />
        <Route path="/user/help" element={<Help />} />
        <Route path="/user/notifications" element={<Notifications />} />
        <Route path="/user/profile" element={<Profile />} />
        
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/home" element={<ClientHome />} />
        <Route path="/client/publish" element={<PublishDemand />} />
        <Route path="/client/orders" element={<ClientOrders />} />
        <Route path="/client/review/:id" element={<ReviewWork />} />
        <Route path="/client/actors" element={<VoiceActors />} />
        <Route path="/client/profile" element={<ClientProfile />} />
        <Route path="/client/expenses" element={<Expenses />} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/manuscripts" element={<ManuscriptProcessing />} />
        <Route path="/admin/dispatch" element={<OrderDispatch />} />
        <Route path="/admin/quality" element={<QualityReview />} />
        <Route path="/admin/counselors" element={<CounselorManagement />} />
        <Route path="/admin/organizations" element={<OrganizationManagement />} />
        <Route path="/admin/finance" element={<FinancialSettlement />} />
      </Routes>
    </Router>
  );
}
