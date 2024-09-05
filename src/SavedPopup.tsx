import './css/saved-popup.css';

import React from "react";

interface SavedPopupProps {
    show: boolean,
    onDone: () => void
}

const SavedPopup: React.FunctionComponent<SavedPopupProps> = (props) => {
    return <div className={props.show ? "notify" : "invisible"}
                onAnimationEnd={props.onDone}>
        <div className="notification">SVG File Saved!</div>
    </div>
}
export default SavedPopup;