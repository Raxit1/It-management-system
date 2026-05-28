import { useState } from "react";

import Layout from "../components/Layout";

function TeamChat() {

    const [message, setMessage] =
        useState("");

    const [messages, setMessages] =
        useState([

            {
                sender: "Manager",

                text: "Welcome Team!"
            }
        ]);

    const sendMessage = () => {

        if (!message) return;

        setMessages([

            ...messages,

            {
                sender: "You",

                text: message
            }
        ]);

        setMessage("");
    };

    return (

        <Layout>

            <h1 className="page-title">

                Team Chat

            </h1>

            <div
                style={{
                    background: "white",

                    padding: "20px",

                    borderRadius: "12px",

                    height: "500px",

                    overflowY: "auto",

                    marginBottom: "20px"
                }}
            >

                {messages.map(

                    (msg, index) => (

                        <div
                            key={index}

                            style={{
                                marginBottom:
                                    "15px"
                            }}
                        >

                            <strong>

                                {msg.sender}

                            </strong>

                            <p>

                                {msg.text}

                            </p>

                        </div>
                    )
                )}

            </div>

            <div
                style={{
                    display: "flex",
                    gap: "10px"
                }}
            >

                <input
                    type="text"

                    value={message}

                    onChange={(e) =>
                        setMessage(
                            e.target.value
                        )
                    }

                    placeholder="Type message..."

                    className="form-input"
                />

                <button
                    onClick={sendMessage}

                    className="btn btn-add"
                >

                    Send

                </button>

            </div>

        </Layout>
    );
}

export default TeamChat;