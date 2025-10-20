import * as React from "react";

import { NavItem, NavItemProps } from "@/app/components/shared/nav/NavItem";
import { NavCategory, NavCategoryProps } from "@/app/components/shared/nav/NavCategory";

interface NavRendererProps {
    items: (NavItemProps | NavCategoryProps)[];
}

function isCategory(item: NavItemProps | NavCategoryProps): item is NavCategoryProps {
    return 'items' in item;
}


// 4. Componente NavRenderer Final
export const NavRenderer: React.FC<NavRendererProps> = ({ items }) => {
    return (
        <>
            {items.map((item) => {
                if (isCategory(item)) {
                    return (
                        <NavCategory
                            key={item.value}
                            {...item}
                        />
                    );
                } else {
                    return (
                        <NavItem
                            key={item.value}
                            {...item}
                        />
                    );
                }
            })}
        </>
    );
};