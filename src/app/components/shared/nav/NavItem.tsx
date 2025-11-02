import { useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/app/providers/i18n";
import { bundleIcon, FluentIcon } from "@fluentui/react-icons";
import {
    NavItem as FluentNavItem,
} from "@fluentui/react-components";

const NAV_NAME_SPACE = "nav"

export type NavItemProps = {
    href: string,
    labelKey: string,
    iconDefault: FluentIcon,
    iconSelected: FluentIcon,
    value: string,
};

export const NavItem = (itemProps : NavItemProps) => {
    const Icon = bundleIcon(itemProps.iconSelected, itemProps.iconDefault)
    const i18n = useI18n();

    useEffect(() => {
        void i18n.loadChunk(NAV_NAME_SPACE);
    }, [i18n.loadChunk])

    return (
        <Link href={itemProps.href} style={{ textDecoration: 'none' }}>
            <FluentNavItem
                icon={<Icon/>}
                value={itemProps.value}
            >
                {i18n.t(NAV_NAME_SPACE, itemProps.labelKey)}
            </FluentNavItem>
        </Link>
    );
};