import React, { useEffect } from "react";
import { useI18n } from "@/app/providers/i18n";
import {
    NavSubItem as FluentNavSubItem,
    NavSubItemGroup as FluentNavSubItemGroup,
} from "@fluentui/react-components";
import Link from "next/link";

const NAV_NAME_SPACE = "nav"

export type NavCategorySubItemProps = {
    href: string,
    labelKey: string,
    value: string,
}

export type NavCategorySubItemContainerProps = {
    items: NavCategorySubItemProps[];
}

export const NavCategorySubItem= ({ items } : NavCategorySubItemContainerProps) => {
    const i18n = useI18n();

    useEffect(() => {
        void i18n.loadChunk(NAV_NAME_SPACE);
    }, [i18n.loadChunk])

    return (
        <FluentNavSubItemGroup>
            {items.map((item, index) => (
                <Link href={item.href} style={{ textDecoration: 'none' }} key={index}>
                    <FluentNavSubItem
                        value={item.value}
                    >
                        {i18n.t(NAV_NAME_SPACE, item.labelKey)}
                    </FluentNavSubItem>
                </Link>
            ))}
        </FluentNavSubItemGroup>
    )
}