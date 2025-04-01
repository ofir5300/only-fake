import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { NewsSource, SOURCES } from "@only-fake/shared";
import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Tooltip from "@mui/material/Tooltip";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { useArticles } from "./hooks/useArticles";
const logo = require("./assets/logo.png");

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
      paper: "#111111",
    },
    primary: {
      main: "#FF3366",
    },
  },
  typography: {
    fontFamily: "'Outfit', sans-serif",
    h1: {
      fontSize: "3.5rem",
      fontWeight: 800,
      background: "linear-gradient(45deg, #FF3366, #FF6B6B)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
        },
      },
    },
  },
});

const MotionGrid = motion(Grid);
const MotionBox = motion(Box);

export const App = () => {
  const {
    data,
    setData,
    loading,
    setLoading,
    error,
    status,
    streamArticles,
    selectedSource,
    setSelectedSource,
  } = useArticles();

  const handleSourceChange = (
    _event: React.MouseEvent<HTMLElement>,
    newSource: NewsSource | null
  ) => {
    if (newSource !== null) {
      setSelectedSource(newSource);
      setData([]);
      setLoading(true);
      streamArticles(newSource);
    }
  };

  useEffect(() => {
    streamArticles(selectedSource);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <MotionBox
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, #FF3366 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, #FF3366 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, #FF3366 0%, transparent 50%)",
              "radial-gradient(circle at 100% 0%, #FF3366 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
          }}
        />

        {/* Header */}
        <Container maxWidth="lg" sx={{ pt: 8, pb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 6,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box
                component="img"
                src={logo}
                alt="Only Fake Logo"
                sx={{
                  height: 80,
                  filter: "drop-shadow(0 0 12px rgba(255, 51, 102, 0.4))",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    filter: "drop-shadow(0 0 20px rgba(255, 51, 102, 0.6))",
                    transform: "scale(1.08)",
                  },
                }}
              />
              <Typography variant="h1">ONLY FAKE</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: status === "Connected" ? "#4CAF50" : "#FF3366",
                  opacity: 0.8,
                }}
              >
                {status}
              </Typography>
              <IconButton
                onClick={() => streamArticles(selectedSource)}
                disabled={loading}
                sx={{
                  background: "linear-gradient(45deg, #FF3366, #FF6B6B)",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <AutorenewIcon />
                )}
              </IconButton>
            </Box>
          </Box>

          {/* Source Selector */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
              gap: 2,
              alignItems: "center",
            }}
          >
            <ToggleButtonGroup
              value={selectedSource}
              exclusive
              onChange={handleSourceChange}
              aria-label="news source"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.03)",
                borderRadius: 2,
                "& .MuiToggleButton-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  "&.Mui-selected": {
                    background: "linear-gradient(45deg, #FF3366, #FF6B6B)",
                    color: "white",
                  },
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                  },
                },
              }}
            >
              <ToggleButton value={SOURCES.CNN}>CNN</ToggleButton>
              <ToggleButton value={SOURCES.GEEKTIME}>GeekTime</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Dynamic content based on state */}
          {loading && data.length === 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "50vh",
              }}
            >
              <CircularProgress
                size={60}
                thickness={4}
                sx={{
                  color: "#FF3366",
                }}
              />
            </Box>
          )}

          {!loading && error && (
            <Box
              sx={{
                textAlign: "center",
                p: 6,
                borderRadius: 2,
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  background: "linear-gradient(45deg, #FFF, #FF3366)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {selectedSource} Articles Unavailable
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                We're currently unable to fetch articles from {selectedSource}.
                Try switching to another news source.
              </Typography>
            </Box>
          )}

          {!error && data.length > 0 && (
            <Grid container spacing={4}>
              {data.map((article, index) => (
                <MotionGrid
                  item
                  xs={12}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  key={`${selectedSource}-${index}`}
                >
                  <Tooltip
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {article.title}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<OpenInNewIcon />}
                          onClick={() => window.open(article.url, "_blank")}
                          sx={{
                            background:
                              "linear-gradient(45deg, #FF3366, #FF6B6B)",
                          }}
                        >
                          Read Original
                        </Button>
                      </Box>
                    }
                    arrow
                  >
                    <Box
                      sx={{
                        p: 4,
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.03)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          background: "rgba(255, 255, 255, 0.05)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="overline"
                          sx={{ color: "#FF3366" }}
                        >
                          {article.category}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.5 }}>
                          {format(new Date(), "MMM dd, yyyy")}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                          mb: 2,
                          fontWeight: 700,
                          background: "linear-gradient(45deg, #FFF, #FF3366)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {article.fake_title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ opacity: 0.8, lineHeight: 1.8 }}
                      >
                        {article.fake_description}
                      </Typography>
                    </Box>
                  </Tooltip>
                </MotionGrid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};
