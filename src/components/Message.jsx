import React from 'react';

const Message = ({ sender, text }) => {
    return (
        <div className={`message ${sender}`}>
            <div className="bubble" dangerouslySetInnerHTML={{ __html: text }} />
        </div>
    );
};

export default Message;