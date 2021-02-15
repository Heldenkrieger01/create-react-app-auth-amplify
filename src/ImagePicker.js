import Amplify, { API, Storage, Auth } from "aws-amplify";
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions'
import React, { useState, useRef, useCallback } from "react";
import { useDropzone } from 'react-dropzone'
import aws_exports from './aws-exports';
import { v4 as uuidv4} from 'uuid';
Amplify.configure(aws_exports);
Amplify.addPluggable(new AmazonAIPredictionsProvider())

const ImagePicker = () => {
  const [image, setImage] = useState("");
  const [imgData, setImgData] = useState(null);
  const inputFile = useRef(null);
  const [uploadResult, setUploadResult] = useState("")
  const [predictionResult, setPredictionResult] = useState("")

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
    Auth.currentUserCredentials()
      .then(result => console.log(result.data.IdentityId))
    setUploadResult("")
    setPredictionResult("")
    var filename = file.name;
    var parts = filename.split(".");
    const fileType = parts[parts.length - 1];
    if (fileType.toLowerCase() === "jpg" || fileType.toLowerCase() === "png") {
      var uniqueid = uuidv4();
      parts[0] = parts[0].concat("-")
      parts[0] = parts[0].concat(uniqueid)
      var unique_filename = parts.join('.')
      setImage(file);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(file)
      // Todo: handle AWS Service
      Storage.put(unique_filename, file, {level: 'private'})
        .then(() => setUploadResult("Upload successfull!"))
        .catch(() => setUploadResult("Upload failed!"))
      Predictions.identify({
        labels: {
          source: {
            file,
          },
          type: "ALL"
        }
      })
        .then(response => handlePredictionResult(response))
        .catch(error => console.log(error))
    }
    else
      setUploadResult("Please select an image!")
  }

  const handlePredictionResult = result => {
    if (result?.labels.length > 0)
      setPredictionResult(result.labels[0].name)
  }

  const onUploadClick = () => {
    inputFile.current.click();
  };

  const onCorrectClick = () => {
    connectToApi(true)
  }

  const onWrongClick = () => {
    connectToApi(false)
  }

  const connectToApi = isAccurate => {
    var api = API.createInstance()
    console.log(api)
    var ep = API.endpoint("api1939e8e6")
    console.log(ep)
    API.post("api1939e8e6", "/stats", null)
      .then(result => console.log(result))
      .catch(err => console.log(err))
  }

  return (
    <div>
      <div className="dropzone" {...getRootProps({ className: 'dropzone' })}>
        Drag &amp; Drop your file here or click Upload.
        <p />
        <input {...getInputProps()}
          style={{ display: "none" }}
          accept=".jpg,.png"
          ref={inputFile}
          onChange={handleButtonUpload}
          type="file"
        />
        <div id="orange-button" onClick={onUploadClick}>
          Upload
        </div>
        <div className={uploadResult === "" ? "hidden" : "upload-message"}>
          {uploadResult}
        </div>
      </div>
      <div>
        <p className="upload-break" />
        <img className="upload-image" src={imgData} />
      </div>
      <div className={predictionResult === "" ? "hidden" : "upload-prediction-result"}>
        {predictionResult}
      </div>
      <div className={predictionResult === "" ? "hidden" : "upload-predictions"}>
        <p />
        <h3>
          Please leave your feedback for this prediction:
        </h3>
        <div className="upload-row">
          <button className="upload-col" id="orange-button" onClick={onCorrectClick}>
            Accurate
          </button>
          <button className="upload-col" id="orange-button" onClick={onWrongClick}>
            Wrong
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePicker;
