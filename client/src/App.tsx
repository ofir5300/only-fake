import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

interface DummyData {
  message: string;
  timestamp: string;
}

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
  const [data, setData] = useState<DummyData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3002/api/dummy-data");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Only Fake
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your React + MUI application is running successfully!
          </Typography>

          <Button
            variant="contained"
            onClick={fetchData}
            disabled={loading}
            sx={{ my: 2 }}
          >
            {loading ? "Loading..." : "Fetch Dummy Data"}
          </Button>

          {data && (
            <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Server Response:
              </Typography>
              <Typography variant="body1">{data.message}</Typography>
              <Typography variant="caption" color="text.secondary">
                Received at: {new Date(data.timestamp).toLocaleString()}
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
