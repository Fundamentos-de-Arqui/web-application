'use client';

import React from "react";
import NavDrawer from "@/app/components/shared/nav/NavDrawer";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
    mainDiv: {
        height: "100vh",
    },
    secondaryDiv: {
        display: "flex",
        flexDirection: "row",
        height: "100%",
    }
});

export default function FeaturesLayout(
    {children}: Readonly<{ children: React.ReactNode; }>
) {
    const styles = useStyles();

    return (
        <div className={styles.mainDiv}>
            <div className={styles.secondaryDiv}>
                <NavDrawer/>
                {children}
            </div>
        </div>
    );
}