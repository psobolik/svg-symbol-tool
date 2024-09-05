import './css/footer.css';

import React from "react";
import {invoke} from "@tauri-apps/api/tauri";

const Footer: React.FunctionComponent = () => {
    const [footer, setFooter] = React.useState<string>("");

    React.useEffect(() => {
        let is_setup = false;
        const setupFooter = async () => {
            const version = await invoke("version");
            if (!is_setup)
                setFooter(`Copyright © 2024 Paul Sobolik - v${version}`);
        }
        setupFooter().catch(console.error);
        return () => {
            is_setup = true;
        }
    })
    return <footer className="footer">{footer}</footer>

}
export default Footer;