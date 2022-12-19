import { CloseSharp } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

export default function CloseModalButton({ close }) {

    return (
        <IconButton
            onClick={close}
            sx={{ right: 12, top: 12 }}
        >
            <CloseSharp />
        </IconButton>
    )
}