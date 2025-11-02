import React, { useEffect } from "react";
import { useI18n } from "@/app/providers/i18n";
import {
    NavSectionHeader as FluentNavSectionHeader,
} from "@fluentui/react-components";

const NAV_NAME_SPACE = "nav";

export type NavSectionHeaderProps = {
    labelKey: string;
};

export const NavSectionHeader = ({ labelKey }: NavSectionHeaderProps) => {
    const i18n = useI18n();

    useEffect(() => {
        void i18n.loadChunk(NAV_NAME_SPACE);
    }, [i18n.loadChunk]);

    return (
        <FluentNavSectionHeader>
            {i18n.t(NAV_NAME_SPACE, labelKey)}
        </FluentNavSectionHeader>
    );
};