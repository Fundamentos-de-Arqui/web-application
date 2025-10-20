import React from "react";
import { NavCategory as FluentNavCategory } from "@fluentui/react-components";
import { NavCategoryItem, NavCategoryItemProps } from "./NavCategoryItem";
import { NavCategorySubItem, NavCategorySubItemProps } from "./NavSubItem";

export interface NavCategoryProps extends NavCategoryItemProps {
    items: NavCategorySubItemProps[];
}

export const NavCategory = (props: NavCategoryProps) => {
    const { items, ...itemProps } = props;

    return (
        <FluentNavCategory value={itemProps.value}>
            <NavCategoryItem {...itemProps} />
            <NavCategorySubItem items={items} />
        </FluentNavCategory>
    );
};