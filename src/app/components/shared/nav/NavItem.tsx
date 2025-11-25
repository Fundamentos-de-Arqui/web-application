import Link from "next/link";
import { bundleIcon, FluentIcon } from "@fluentui/react-icons";
import {
    NavItem as FluentNavItem,
} from "@fluentui/react-components";

export type NavItemProps = {
    href: string,
    label: string,
    iconDefault: FluentIcon,
    iconSelected: FluentIcon,
    value: string,
};

export const NavItem = (itemProps : NavItemProps) => {
    const Icon = bundleIcon(itemProps.iconSelected, itemProps.iconDefault)

    return (
        <Link href={itemProps.href} style={{ textDecoration: 'none' }}>
            <FluentNavItem
                icon={<Icon/>}
                value={itemProps.value}
            >
                {itemProps.label}
            </FluentNavItem>
        </Link>
    );
};