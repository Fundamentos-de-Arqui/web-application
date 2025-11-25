import {
    NavSubItem as FluentNavSubItem,
    NavSubItemGroup as FluentNavSubItemGroup,
} from "@fluentui/react-components";
import Link from "next/link";


export type NavCategorySubItemProps = {
    href: string,
    label: string,
    value: string,
}

export type NavCategorySubItemContainerProps = {
    items: NavCategorySubItemProps[];
}

export const NavCategorySubItem= ({ items } : NavCategorySubItemContainerProps) => {
    return (
        <FluentNavSubItemGroup>
            {items.map((item, index) => (
                <Link href={item.href} style={{ textDecoration: 'none' }} key={index}>
                    <FluentNavSubItem
                        value={item.value}
                    >
                        {item.label}
                    </FluentNavSubItem>
                </Link>
            ))}
        </FluentNavSubItemGroup>
    )
}