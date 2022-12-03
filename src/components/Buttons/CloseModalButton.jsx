import { CloseSharp } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

export default function CloseModalButton({ close }) {

    return (
        <IconButton
            onClick={close}
            sx={{ position: 'absolute', right: 32, top: 32 }}
        >
            <CloseSharp />
        </IconButton>
    )
}