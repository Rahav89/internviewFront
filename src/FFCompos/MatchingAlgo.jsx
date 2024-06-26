import * as React from "react";
import { styled } from "@mui/material/styles";
import { Grid, Container, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import MenuLogo from "../FFCompos/MenuLogo";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function MatchingAlgo() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/new-page"); // עדכן את הנתיב לדף החדש
  };

  return (
    <>
      <MenuLogo />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 3 }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                width: "300px", // קבע רוחב קבוע
                backgroundColor: "white",
                color: "#1976d2",
                borderColor: "#1976d2",
                borderWidth: 2,
                borderStyle: "solid",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  borderColor: "darkblue",
                },
              }}
            >
              העלאת טבלת תורנויות
              <VisuallyHiddenInput type="file" accept=".xlsx, .xls" />
            </Button>
          </Grid>
          <Grid item>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                width: "300px", // קבע רוחב קבוע
                backgroundColor: "white",
                color: "#1976d2",
                borderColor: "#1976d2",
                borderWidth: 2,
                borderStyle: "solid",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  borderColor: "darkblue",
                },
              }}
            >
              העלאת טבלת ניתוחים עתידיים
              <VisuallyHiddenInput type="file" accept=".xlsx, .xls" />
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleNavigate}
              sx={{
                width: "300px", // קבע רוחב קבוע
                backgroundColor: "#1976d2",
                color: "white",
                "&:hover": {
                  backgroundColor: "darkblue",
                },
              }}
            >
              מצא שיבוץ
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
