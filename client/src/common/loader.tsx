import React from "react";
import { CircularProgress, Box } from "@mui/material";

type Props = {
  size?: number;
};

export const Loader = ({ size = 24 }: Props) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress size={size} />
    </Box>
  );
}
