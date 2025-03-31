import React, { useEffect, useRef, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  FakeArticle,
  SOURCES,
} from "@only-fake/shared";
import { useSSE } from "./hooks/useSSE";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const [data, setData] = useState<FakeArticle[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api${API_ENDPOINTS.ARTICLES}/${SOURCES.CNN}`
      ); //. todo modular per source
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const { connect } = useSSE(
    `${API_BASE_URL}/api${API_ENDPOINTS.ARTICLES_STREAM}/${SOURCES.CNN}`,
    {
      onOpen: () => {
        setLoading(true);
        setData([]); // Reset data on new connection
      },
      onMessage: (event) => {
        console.log("Received event:", event); // Debug
        const article = event as FakeArticle;
        setData((prev) => [...prev, article]);
      },
      onError: () => {
        setLoading(false);
      },
    }
  );

  // Auto-connect on mount
  useEffect(() => {
    connect();
  }, []);

  const handleGenerate = () => {
    setLoading(true);
    setData([]); // Clear existing data
    connect(); // Start new connection
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Only Fake
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Now faking data from {SOURCES.CNN}
          </Typography>

          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={loading}
            sx={{ my: 2 }}
          >
            {loading ? "Generating..." : "Generate Articles"}
          </Button>

          <Box sx={{ mt: 2 }}>
            {data.map((article, index) => (
              <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {article.fake_title}
                </Typography>
                <Typography variant="body1">
                  {article.fake_description}
                </Typography>
                {article.category && (
                  <Typography variant="caption" color="text.secondary">
                    Category: {article.category}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
