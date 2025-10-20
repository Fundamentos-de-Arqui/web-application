'use client';

import {Title2, Text} from "@fluentui/react-components";

export default function SignOutPage() {
    return (
        <div>
            <Title2>Sign out Overview</Title2>
            <Text size={400} block>
                For security matters, sign out is on its own page that will execute logic calling the backend safely erase cookies. Then the page should redirect back into login again.
            </Text>
        </div>
    );
}