import Amplify, { Storage } from "aws-amplify";
import React, { useState, useRef, useCallback } from "react";
import { useDropzone } from 'react-dropzone'
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

const ImagePicker = () => {
    const [image, setImage] = useState("");
    const [imgData, setImgData] = useState(null);
    const inputFile = useRef(null);

    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles[0])
        fileUpload(acceptedFiles[0])
    })

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true
    });

    const handleButtonUpload = e => {
        const { files } = e.target;
        if (files && files.length) {
            fileUpload(files[0])
        }
    };

    const fileUpload = file => {
        const filename = file.name;
        var parts = filename.split(".");
        const fileType = parts[parts.length - 1];
        if (fileType.toLowerCase() === "jpg" || fileType.toLowerCase() === "png") {
            setImage(file);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImgData(reader.result);
            });
            reader.readAsDataURL(file)
            // Todo: handle AWS Service
            Storage.put(filename, file)
                .then(result => console.log(result))
                .catch(err => console.log("Error: ", err))
        }
        else
            console.log("not an image!!!")
    }

    const onButtonClick = () => {
        inputFile.current.click();
    };

    return (
        <div>
            <div className="dropzone" {...getRootProps({ className: 'dropzone' })}>
                Drag &amp; Drop your file here or click Upload.
                <p/>
                <input {...getInputProps()}
                    style={{ display: "none" }}
                    accept=".jpg,.png"
                    ref={inputFile}
                    onChange={handleButtonUpload}
                    type="file"
                />
                <div className="upload-button" onClick={onButtonClick}>
                    Upload
                </div>
            </div>
            <div>
                <p className="upload-break" />
                <img className="upload-image" src={imgData} />
            </div>
        </div>
    );
};

export default ImagePicker;
