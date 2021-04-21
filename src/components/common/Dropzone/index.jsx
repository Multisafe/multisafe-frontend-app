import React, { useCallback } from "react";
import csv from "csv";
import { useDropzone } from "react-dropzone";

import UploadIcon from "assets/icons/dashboard/upload-icon.svg";
import { Container } from "./styles";
import Img from "../Img";

export default function Basic(props) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      try {
        // Do something with the files
        const reader = new FileReader();
        reader.onload = () => {
          csv.parse(reader.result, (err, data) => {
            const fileName = acceptedFiles[0].path;
            props.onDrop(data ? data.slice(1) : undefined, fileName);
          });
        };

        reader.readAsBinaryString(acceptedFiles[0]);
      } catch (err) {
        console.error(err);
        props.onDrop(undefined, "Invalid file");
      }
    },
    [props]
  );

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ maxFiles: 1, accept: ".csv", onDrop });

  const files = acceptedFiles.map((file) => (
    <span key={file.path}>
      {file.path} - {file.size} bytes
    </span>
  ));

  return (
    <section>
      <Container
        {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
        style={props.style}
      >
        <input {...getInputProps()} />
        {files && files.length > 0 ? (
          <div className="upload">
            <div className="drag-text">Uploaded - {files}</div>
          </div>
        ) : (
          <div className="upload">
            <Img src={UploadIcon} alt="upload" className="upload-icon" />
            <p className="drag-text">Drag and drop your .csv file here</p>
            <p className="click-text">Click to upload</p>
          </div>
        )}
      </Container>
    </section>
  );
}
