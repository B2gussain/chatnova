import React from "react";

const TypingLoader = () => {
    return (
        <div className="flex items-center animate-pulse">
            <div className="h-10 w-10 rounded-full bg-primary "></div>
            <div className="flex items-center  space-x-2 ml-2 bg-primary w-fit rounded-2xl px-4  py-2">
                <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                </div>
                <span className="text-sm text-white font-semibold">
                    Typing...
                </span>
            </div>
        </div>
    );
};

export default TypingLoader;
