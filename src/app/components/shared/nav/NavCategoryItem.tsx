import React, { useEffect } from "react";
import { bundleIcon, FluentIcon } from "@fluentui/react-icons";
import {
    NavCategoryItem as FluentNavCategoryItem,
} from "@fluentui/react-components";

export type NavCategoryItemProps = {
    labelKey: string,
    iconDefault: FluentIcon,
    iconSelected: FluentIcon,
    value: string,
}

export const NavCategoryItem= (itemProps : NavCategoryItemProps) => {
    const Icon = bundleIcon(itemProps.iconSelected, itemProps.iconDefault)

    return (
        <FluentNavCategoryItem icon={<Icon/>}>{itemProps.labelKey}</FluentNavCategoryItem>
    )
}