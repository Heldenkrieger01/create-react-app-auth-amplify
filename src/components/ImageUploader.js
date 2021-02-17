import Amplify, { API, Storage, Auth } from "aws-amplify";
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions'
import React, { useState, useRef, useCallback } from "react";
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4} from 'uuid';
import "../styles/ImageUploader.css"
Amplify.addPluggable(new AmazonAIPredictionsProvider())

//hook is async and does not work... sadly
var global_name = "";

const ImageUploader = () => {
  const [imgData, setImgData] = useState(null);
  const inputFile = useRef(null);
  const [uploadResult, setUploadResult] = useState("")
  const [predictionResult, setPredictionResult] = useState("")
  const [feedbackGiven, setFeedbackGiven] = useState(false)

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

  const fileUpload = (file) => {
    setUploadResult("")
    setPredictionResult("")
    setFeedbackGiven(false)
    global_name = ""
    var filename = file.name;
    var parts = filename.split(".");
    const fileType = parts[parts.length - 1];
    if (fileType.toLowerCase() === "jpg" || fileType.toLowerCase() === "png") {
      var uniqueid = uuidv4();
      parts[0] = parts[0].concat("-")
      parts[0] = parts[0].concat(uniqueid)
      var unique_filename = parts.join('.')
      global_name = unique_filename
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(file)
      // Todo: handle AWS Service
      Storage.put(global_name, file, {level: 'private'})
        .then(() => handleUploadSuccess())
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

  const handleUploadSuccess = () => {
    console.log("upload success")
    setUploadResult("Upload successfull!")
    Auth.currentUserPoolUser().then(user => {
      console.log(user.attributes.sub)
      API.post("api1939e8e6", "/archive", {
        body: {
          user: user.attributes.sub,
          filename: global_name,
        }
      })
        .then(result => console.log(result))
        .catch(err => console.log(err.body))
    })
  }

  const handlePredictionResult = result => {
    console.log(result)
    if (result?.labels.length > 0)
      Auth.currentUserPoolUser().then(user => {
        API.post("api1939e8e6", "/category", {
          body: {
            user: user.attributes.sub,
            filename: global_name,
            predictionList: result
          }
        })
          .then(responseBody => { 
            if(responseBody.category === "NOT_DEFINED")
              setPredictionResult("Undefined")
            else 
              setPredictionResult(responseBody.category)
          })
          .catch(err => console.log(err.body))
      })
  }

  const onUploadClick = () => {
    inputFile.current.click();
  };

  const onCorrectClick = () => {
    setFeedbackGiven(true)
    uploadFeedback(true)
  }

  const onWrongClick = () => {
    setFeedbackGiven(true)
    uploadFeedback(false)
  }

  const uploadFeedback = isAccurate => {
    Auth.currentUserPoolUser().then(user => {
      console.log(user.attributes.sub)
      console.log(global_name)
      API.post("api1939e8e6", "/newFeedback", {
        body: {
          user: user.attributes.sub,
          filename: global_name,
          feedback: isAccurate,
          category: predictionResult
        }
      })
        .then(result => console.log(result))
        .catch(err => console.log(err.body))
    })
  }

  return (
    <div>
      <div className="upload-dropzone" {...getRootProps({ className: 'upload-dropzone' })}>
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
          <button disabled={feedbackGiven} className="upload-col" id="orange-button" onClick={onCorrectClick}>
            Accurate
          </button>
          <button disabled={feedbackGiven} className="upload-col" id="orange-button" onClick={onWrongClick}>
            Wrong
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
