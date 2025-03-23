import './css/footer.css';

import React from "react";
import {invoke} from "@tauri-apps/api/tauri";

const Footer: React.FunctionComponent = () => {
    const [footer, setFooter] = React.useState<string>("");

    let is_setup = false;

    React.useEffect(() => {
        if (is_setup) return;

        invoke("version").then(version => {
            setFooter(`Copyright © 2024, 2025 Paul Sobolik - v${version}`);
        })
        return () => {
            is_setup = true;
        }
    }, [])
    return <footer className="footer">{footer}</footer>
}
export default Footer;