import React, {useEffect, useState} from 'react';
import './FileUpload.css';

import { useAuth } from '../../AuthProvider';
import {useNavigate, Link} from "react-router-dom";

function FileUpload(){
    const {user, logout} = useAuth();
    const navigate = useNavigate();


    return user ? (

                <ReturnFileUpload />

    ) : (
        <RequireLoginMessage />
    );

}

function RequireLoginMessage() {
    return (
        <div className="rlm-wrapper">
            <p className="rlm-text">
                You need to <span className="rlm-em">login</span> or&nbsp;
                <span className="rlm-em">register</span> to be able to make quizzes
            </p>
            <div className="rlm-btn-group">
                <Link to="/login" className="LoginButton rlm-btn">
                    Login
                </Link>
                <span className="rlm-divider">or</span>
                <Link to="/register" className="LoginButton rlm-btn">
                    Register
                </Link>
            </div>
        </div>
    );
}

function ReturnFileUpload() {
    const [file, setFile] = useState(null);
    const { user } = useAuth();
    const [nrQuestions, setNrQuestions] = useState(5);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const handleFileChange = (e) => {
        setFile(e.target.files[0])

    };
    const options = Array.from({ length: 8 }, (_, i) => (i + 1) * 5);
    const handleFileUpload = () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        if (user) formData.append("userId", user.user_id);
        formData.append("title", file.name);
        formData.append("nrQuestions", nrQuestions);

        setIsLoading(true);                        // ⬅️ start spinner

        fetch("/api/upload", { method: "POST", body: formData })
            .then((r) => r.json())
            .then((data) => {
                console.log("Response from server:", data);
                if (data.success) {
                    console.log("File uploaded successfully");
                    navigate(`/old_quizzes`);
                } else{
                    console.error("Upload failed:", data.message);
                    document.getElementById('errorBox').innerHTML = data.message || 'Upload failed';
                }
            })
            .catch((err) => console.error("Upload error:", err))
            .finally(() => setIsLoading(false));     // ⬅️ stop spinner
    };
    const changeNrQuestions = (e) => {
        setNrQuestions(e.target.value);
    }

    return (
        <div className="file-upload-body">
            <div className="upload-card">
                {isLoading && <div className="spinner" />}   {/* simple overlay */}
                {/* intro text -------------------------------------------------- */}
                <p className="about-us-fileupload-text">
                    Welcome to our easy upload portal! Click the button below to pick a document,
                    then choose how many questions you’d like. We’ll generate a quiz for you
                    in just a few clicks.
                </p>

                {/* upload controls -------------------------------------------- */}
                <div className="file-upload-upload-container">
                    {/* hidden <input type="file"> lives inside the label */}
                    <label className="upload-btn">
                        Choose File
                        <input type="file" onChange={handleFileChange} />
                    </label>

                    <button
                        className="upload-btn"
                        disabled={!file}
                        onClick={handleFileUpload}
                    >
                        Upload File
                    </button>

                    {/* filename preview */}
                    {file && <span className="file-name">{file.name}</span>}
                </div>

                {/* question selector ------------------------------------------ */}
                <div className="nr-of-questions-container">
                    <select
                        className="nr-selector"
                        value={nrQuestions}
                        onChange={(e) => setNrQuestions(e.target.value)}
                    >
                        {options.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>

                    <div className="nr-questions">
                        {nrQuestions} : Number of questions to be generated
                    </div>
                    <div>
                        <span id={'errorBox'}></span>
                    </div>
                </div>
            </div>
        </div>
    );


}

export default FileUpload;