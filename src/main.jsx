import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import SignInSide from "./page/auth/SignInSide";
import SignUp from "./page/auth/SignUp";
import App from "./App";
import Dashboard from "./page/dashboard/Dashboard";
import Team from "./page/team/Team";
import Client from "./page/client/Client";
import Supplier from "./page/supplier/Supplier";
import NotFound from "./page/notFound/NotFound";
import ResetPasswordForm from "./page/auth/ResetPasswordForm";
import ReclamationForm from "./page/reclamation/ReclamationForm";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import SettingAlert from "./page/settingalert/SettingAlert";
import ChangePassword from "./page/auth/ChangePassword";
import Services from "./page/services/Services";
import SeeAlerts from "./page/seeAlert/SeeAlerts";
import Facture from "./page/facture/Facture";
import Permessions from "./page/permession/Permessions";
import UserPermissions from "./page/userPermession/UserPermessions";
import ClientPermissions from "./page/clientPermission/ClientPermissions";

function ProtectedRoute({ children }) {
  // @ts-ignore
  const user = useSelector((state) => state.user?.userInfo);
  return user ? children : <Navigate to="/" />;
}

function PublicRoute({ children }) {
  // @ts-ignore
  const user = useSelector((state) => state.user?.userInfo);
  return user ? <Navigate to="/home" /> : children;
}

function ProtectAdminRoute({ children }) {
  // @ts-ignore
  const user = useSelector((state) => state.user?.userInfo);
  return user?.isAdmin ? children : <Navigate to="/home/supplier" />;
}

function ProtectUserRoute({ children }) {
  // @ts-ignore
  const user = useSelector((state) => state.user?.userInfo);
  return user?.isAdmin ? <Navigate to="/home/dashboard" /> : children;
}

const routes = (
  <Routes>
    <Route
      path="/"
      element={
        <PublicRoute>
          <SignInSide />
        </PublicRoute>
      }
    />
    <Route
      path="/ResetPasswordForm"
      element={
        <PublicRoute>
          <ResetPasswordForm />
        </PublicRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      }
    />
    <Route
      path="/set-password"
      element={
        <PublicRoute>
          <ChangePassword />
        </PublicRoute>
      }
    />
    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      }
    >
      <Route
        index
        element={
          <ProtectedRoute>
            <ProtectAdminRoute>
              <Dashboard />
            </ProtectAdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="team"
        element={
          <ProtectedRoute>
            <ProtectAdminRoute>
              <Team />
            </ProtectAdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="alertsetting"
        element={
          <ProtectedRoute>
            <SettingAlert />
          </ProtectedRoute>
        }
      />
      <Route
        path="seeAlert"
        element={
          <ProtectedRoute>
            <SeeAlerts />
          </ProtectedRoute>
        }
      />
      <Route
        path="services"
        element={
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        }
      />
      <Route
        path="client"
        element={
          <ProtectedRoute>
            <Client />
          </ProtectedRoute>
        }
      />
      <Route
        path="supplier"
        element={
          <ProtectedRoute>
            <Supplier />
          </ProtectedRoute>
        }
      />
      <Route
        path="reclamation"
        element={
          <ProtectedRoute>
            <ReclamationForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="facture"
        element={
          <ProtectedRoute>
            <Facture />
          </ProtectedRoute>
        }
      />
      <Route
        path="permession"
        element={
          <ProtectedRoute>
            <ProtectAdminRoute>
              <Permessions />
            </ProtectAdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="userPermession"
        element={
          <ProtectedRoute>
            <ProtectAdminRoute>
              <UserPermissions />
            </ProtectAdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="clientPermission"
        element={
          <ProtectedRoute>
            <ProtectAdminRoute>
              <ClientPermissions />
            </ProtectAdminRoute>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>{routes}</BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
