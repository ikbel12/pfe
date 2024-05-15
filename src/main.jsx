import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
// Assurez-vous que le chemin vers votre store est correct
import SignInSide from "./page/auth/SignInSide";
import SignUp from "./page/auth/SignUp";
import App from "./App";
import Dashboard from "./page/dashboard/Dashboard";
import Team from "./page/team/Team";
import Invoices from "./page/invoices/Invoices";
import Calendar from "./page/calendar/Calendar";
import BarChart from "./page/barChart/BarChart";
import PieChart from "./page/pieChart/PieChart";
import LineChart from "./page/lineChart/LineChart";
import NotFound from "./page/notFound/NotFound";
import ResetPasswordForm from "./page/auth/ResetPasswordForm";
import ProfilePage from "./page/profile/ProfilePage";
import Subscriptions from "./page/subscriptions/Subscriptions";
import ReclamationForm from "./page/reclamation/ReclamationForm";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

const routes = (
  <Routes>
    <Route path="/" element={<SignInSide />} />
    <Route path="/ResetPasswordForm" element={<ResetPasswordForm />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/home" element={<App />}>
      <Route index element={<Dashboard />} />
      <Route path="team" element={<Team />} />
      <Route path="subscriptions" element={<Subscriptions />} />
      <Route path="invoices" element={<Invoices />} />
      <Route path="reclamation" element={<ReclamationForm />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="bar" element={<BarChart />} />
      <Route path="pie" element={<PieChart />} />
      <Route path="line" element={<LineChart />} />
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
