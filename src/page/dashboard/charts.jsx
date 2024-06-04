import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { useTheme } from "@mui/material/styles";
import { Paper } from "@mui/material";
import "chart.js/auto";
import "./charts.css"; // Assurez-vous d'importer le fichier CSS pour la mise en page

const Charts = () => {
  const theme = useTheme();
  const [servicesData, setServicesData] = useState({
    labels: [],
    datasets: [
      {
        label: "Nombre de Services",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });
  const [facturesData, setFacturesData] = useState({
    labels: [],
    datasets: [
      {
        label: "Nombre de Factures",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });
  const [reclamationsData, setReclamationsData] = useState({
    labels: [],
    datasets: [
      {
        label: "Nombre de Réclamations",
        data: [],
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  });
  const [clientsData, setClientsData] = useState({
    labels: [],
    datasets: [
      {
        label: "Nombre de Services",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const fetchAndParse = async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok)
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            throw new Error(
              `Expected JSON response but got ${contentType}: ${text}`
            );
          }
          return response.json();
        } catch (error) {
          console.error(`Error fetching data from ${url}:`, error);
          throw error;
        }
      };

      try {
        const [servicesData, facturesData, reclamationsData, clientsData] =
          await Promise.all([
            fetchAndParse(
              "http://localhost:3000/api/chart/services-by-fournisseur"
            ),
            fetchAndParse(
              "http://localhost:3000/api/chart/factures-by-fournisseur"
            ),
            fetchAndParse(
              "http://localhost:3000/api/chart/reclamations-by-category"
            ),
            fetchAndParse(
              "http://localhost:3000/api/chart/clients-with-most-services"
            ),
          ]);

        const facturesColors = facturesData.map(
          (_, index) => `hsl(${(index * 360) / facturesData.length}, 70%, 50%)`
        );

        const clientsColors = clientsData.map(
          (_, index) => `hsl(${(index * 360) / clientsData.length}, 70%, 50%)`
        );

        setServicesData({
          labels: servicesData.map((item) => item.nom),
          datasets: [
            {
              label: "Nombre de Services",
              data: servicesData.map((item) => item.count),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });

        setFacturesData({
          labels: facturesData.map((item) => item.nom),
          datasets: [
            {
              label: "Nombre de Factures",
              data: facturesData.map((item) => item.count),
              backgroundColor: facturesColors,
              borderColor: facturesColors,
              borderWidth: 1,
            },
          ],
        });

        setReclamationsData({
          labels: reclamationsData.map((item) => item._id),
          datasets: [
            {
              label: "Nombre de Réclamations",
              data: reclamationsData.map((item) => item.count),
              backgroundColor: "rgba(255, 206, 86, 0.2)",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 1,
            },
          ],
        });

        setClientsData({
          labels: clientsData.map((client) => client.nom),
          datasets: [
            {
              label: "Nombre de Services",
              data: clientsData.map((client) => client.serviceCount),
              backgroundColor: clientsColors,
              borderColor: clientsColors,
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="charts-container">
      <Paper
        elevation={3}
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(2),
          margin: theme.spacing(2),
        }}
      >
        <div className="chart-item">
          <h1>Number of services per supplier </h1>
          <Bar
            data={servicesData}
            options={{
              responsive: true,
              plugins: { legend: { display: true, position: "top" } },
              scales: {
                x: {
                  ticks: {
                    color: theme.palette.text.primary,
                  },
                },
                y: {
                  ticks: {
                    color: theme.palette.text.primary,
                    stepSize: 1, // Add this line to set the step size
                  },
                },
              },
            }}
          />
        </div>
      </Paper>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(2),
          margin: theme.spacing(2),
        }}
      >
        <div className="chart-item">
          <h1>Reclamations by category</h1>
          <Bar
            data={reclamationsData}
            options={{
              responsive: true,
              plugins: { legend: { display: true, position: "top" } },
              scales: {
                x: {
                  ticks: {
                    color: theme.palette.text.primary,
                  },
                },
                y: {
                  ticks: {
                    color: theme.palette.text.primary,
                    stepSize: 1, // Add this line to set the step size
                  },
                },
              },
            }}
          />
        </div>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(2),
          margin: theme.spacing(2),
        }}
      >
        <div className="chart-item">
          <h1>Clients with the highest number of assigned services</h1>
          <Pie
            data={clientsData}
            options={{
              responsive: true,
              plugins: { legend: { display: true, position: "top" } },
            }}
          />
        </div>
      </Paper>
    </div>
  );
};

export default Charts;
