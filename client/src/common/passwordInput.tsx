import React, { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function PasswordInput({ value, onChange, id="password" }: any) {
  const [show, setShow] = useState(false);

  return (
    <TextField
      label={ id === "password" ? "Password" : "Confirm Password"}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      fullWidth
      sx={{ mb: 1 }}
      required
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShow(!show)} edge="end">
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
