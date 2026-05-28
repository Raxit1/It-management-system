import { useState } from "react";
import Layout from "../components/Layout";

function Documents() {

    const [files, setFiles] =
        useState([]);

    const handleUpload = (e) => {

        const uploadedFiles =
            Array.from(e.target.files);

        setFiles([

            ...files,

            ...uploadedFiles
        ]);
    };

    return (

        <Layout>

            <h1 className="page-title">

                Document Management

            </h1>

            <div className="form-container">

                <input
                    type="file"

                    multiple

                    onChange={handleUpload}
                />

            </div>

            <div
                style={{
                    display: "grid",

                    gap: "15px"
                }}
            >

                {files.map(

                    (file, index) => (

                        <div
                            key={index}

                            className="card"
                        >

                            <h3>

                                {file.name}

                            </h3>

                            <p>

                                {(file.size / 1024)
                                    .toFixed(2)}

                                KB
                            </p>

                        </div>
                    )
                )}

            </div>

        </Layout>
    );
}

export default Documents;