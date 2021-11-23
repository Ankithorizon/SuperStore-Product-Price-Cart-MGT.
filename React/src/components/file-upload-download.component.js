import axios from 'axios';
import React, { Component } from 'react';
import FileHandlerService from "../services/file-handler.service";
import authHeader from '../services/auth-header';
import AuthService from "../services/auth.service";
import { string } from 'yup';
class FileUploadDownload extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sortedListOfFiles: null,

            listOfFiles: null,
            fileToDownload: null,

            selectedFile: null,
            status: '',
            progress: 0,
            statusFlag: 0   // 0 = success, 1 = fail
        };

        // check for logged in or not,,, to prevent browser back history
        if (AuthService.getCurrentUser() === null) {
            this.props.history.push('/login');
            window.location.reload();
        }
    }

    // check for 401
    unAuthHandler401 = (error) => {
        if (error.response.status === 401) {
            console.log('Un-Authorized!');
            this.props.history.push('/un-auth');
            window.location.reload();
        }
        if (error.response.status === 403) {
            console.log('Un-Authorized!');
            this.props.history.push('/un-auth');
            window.location.reload();
        }
    }

    componentDidMount() {
        this.getFileList();
    }

    getFileList() {
        FileHandlerService.getFileList()
            .then(response => {
                this.setState({
                    listOfFiles: response.data
                });
                       
                var tempFileList = [];
                Object.values(response.data).forEach(val => {
                    let onlyLettersArray = (val.split('').filter(char => /[a-zA-Z.]/.test(char))).join("");
                    tempFileList.push({
                        fileName: val,
                        fileNameString: onlyLettersArray
                    })
                });                

                // order by fileNameString
                tempFileList = tempFileList.sort(function (a, b) {
                    if (a.fileNameString < b.fileNameString) {
                        return -1;
                    }
                    if (a.fileNameString > b.fileNameString) {
                        return 1;
                    }
                    // names must be equal
                    return 0;
                });
                this.setState({
                    sortedListOfFiles: tempFileList
                });
            })
            .catch(e => {
                console.log(e);
                this.unAuthHandler401(e);
            });
    }

    setFileToDownload(file, index) {
        this.setState({
            fileToDownload: file
        });
    }

    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
    };

    uploadHandler = (event) => {
        if (this.state.selectedFile == null)
            return;
        
        const formData = new FormData();
        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        console.log(this.state.selectedFile);

        axios.post("https://localhost:44396/api/FileHandler/fileUpload", formData, { headers: authHeader() }, {
        // axios.post("https://localhost:44396/api/FileHandler/fileUpload", formData, {
            onUploadProgress: progressEvent => {
               this.setState({
                    progress: (progressEvent.loaded / progressEvent.total * 100)
                })
            }
        })
            .then((response) => {
                console.log(' Uploaded ProductFile # ' + response.data.productFileId);
                     
                this.setState({ status: `${response.data.responseMessage} ` });
                this.setState({ statusFlag: 0 });
                this.getFileList();
                setTimeout(() => {
                    this.setState(
                        {
                            status: '',
                            selectedFile: null
                        }
                    );
                }, 2000);
            })
            .catch((error) => {
                console.log(error.response.status);
                if (error.response.status == 500) {
                    this.setState(
                        {
                            status: `FAIL : Server Error !`,
                            selectedFile: null,
                            statusFlag: 1
                        }
                    );
                }
                else if (error.response.status == 400) {
                    this.setState(
                        {
                            status: `FAIL : Bad Request !`,
                            selectedFile: null,
                            statusFlag: 1
                        }
                    );
                }                    
                else {
                    this.unAuthHandler401(error);
                }
            })
    }

    // display file info
    fileData = () => {
        if (this.state.selectedFile) {
            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Select File First,,, before Upload!</h4>
                </div>
            );
        }
    };

    render() {
        return (
            <div>
                <div>
                    <h3>
                        File Upload!
                    </h3>
                    <div>
                        <input type="file"
                            onChange={this.onFileChange} />

                        <button onClick={this.uploadHandler}>
                            Upload Handler!
                        </button>
                    </div>
                    {this.fileData()}

                    {/*
                            display api's response, either suceess or fail,,,
                            and progress 0 to 100 %
                        */}

                    <p></p>
                    <hr />
                    <div className="row">
                        <div className="col-sm-5">
                            <h3>File Upload Status</h3>
                            <hr />
                            {this.state.progress > 0 ? (
                                <div className={this.state.progress < 100 ? "progressRunning" : "progressComplete"}>
                                    {this.state.progress}
                                </div>
                            ) : (
                                    <div>
                                    </div>                                    
                            )}
                            <p></p>
                            <div className={this.state.statusFlag > 0 ? "errorClass" : "successClass"}>
                                {this.state.status}
                            </div>
                        </div>
                    </div> 

                    <p></p>
                    <div className="row">
                        <h3>
                            File Download!
                        </h3>
                        <ul>
                            {this.state.sortedListOfFiles ? (
                                this.state.sortedListOfFiles &&
                                this.state.sortedListOfFiles.map((file, index) => (
                                    <li onClick={() => this.setFileToDownload(file, index)}
                                        key={index} >
                                        <a href={"https://localhost:44396/api/FileHandler/download/" + file.fileName} download>{file.fileNameString}  [  @  {(file.fileName).substring(0, (file.fileName).lastIndexOf("-"))} ]</a>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    N/A
                                </li>
                            )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default FileUploadDownload;