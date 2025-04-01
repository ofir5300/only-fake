import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { SOURCES } from "@only-fake/shared";
import { useArticles } from "./hooks/useArticles";
import { useEffect } from "react";

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

export const App = () => {
  const { data, loading, error, status, streamArticles } = useArticles(
    SOURCES.CNN
  );

  // Auto-connect on mount
  useEffect(() => {
    streamArticles();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Only Fake
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Now faking data from {SOURCES.CNN}. Status: {status}{" "}
            {error && `(Error: ${error})`}
          </Typography>

          <Button
            variant="contained"
            onClick={streamArticles}
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
};
