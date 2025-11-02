'use client';

import React, {useEffect} from "react";
import NavDrawer from "@/app/components/shared/nav/NavDrawer";
import { makeStyles } from "@fluentui/react-components";
import {useI18n} from "@/app/providers/i18n";

const NAV_NAME_SPACE = "nav"

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

    const i18n = useI18n();
    useEffect(() => {
        void i18n.loadChunk(NAV_NAME_SPACE);
    }, [i18n.loadChunk])

    return (
        <div className={styles.mainDiv}>
            <div className={styles.secondaryDiv}>
                <NavDrawer/>
                {children}
            </div>
        </div>
    );
}