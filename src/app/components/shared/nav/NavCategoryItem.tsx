import React, { useEffect } from "react";
import { useI18n } from "@/app/providers/i18n";
import { bundleIcon, FluentIcon } from "@fluentui/react-icons";
import {
    NavCategoryItem as FluentNavCategoryItem,
} from "@fluentui/react-components";

const NAV_NAME_SPACE = "nav"

export type NavCategoryItemProps = {
    labelKey: string,
    iconDefault: FluentIcon,
    iconSelected: FluentIcon,
    value: string,
}

export const NavCategoryItem= (itemProps : NavCategoryItemProps) => {
    const Icon = bundleIcon(itemProps.iconSelected, itemProps.iconDefault)
    const i18n = useI18n();

    useEffect(() => {
        void i18n.loadChunk(NAV_NAME_SPACE);
    }, [i18n.loadChunk])

    return (
        <FluentNavCategoryItem icon={<Icon/>}>
            {i18n.t(NAV_NAME_SPACE, itemProps.labelKey)}
        </FluentNavCategoryItem>
    )
}