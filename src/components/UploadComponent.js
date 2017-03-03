import React from 'react';
import Services from '../serviceClients/imageUpload';
import DropzoneComponent from 'react-dropzone-component';
import '../styles/UploadComponent.css';
import 'dropzone/dist/min/dropzone.min.css';

const guid = () => {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
};

const SERVICE_HOST = process.env.REACT_APP_SERVICE_HOST;
const djsConfig = {
    addRemoveLinks: true,
    acceptedFiles: "image/jpeg,image/png,image/gif"
};

const componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: true,
    postUrl: `${SERVICE_HOST}/api/upload`
};

const styles = {
    button: {
        paddingLeft: 15,
        paddingBottom: 10,
        paddingTop: 10
    }
};

export default React.createClass({
    getInitialState(){
        return {processQueue: [], batchId: guid(), action: 'loaded', processedCount: 0 };
    },
    fileAdded(file) {
        this.dropzone.updateTotalUploadProgress();  
    },
    fileRemoved(file) {
        let {processQueue} = this.state;
        processQueue.splice(processQueue.findIndex(fileItem=>file.name === fileItem.originalName), 1);
        this.setState({processQueue});
    },
    initialize(dz){
        this.dropzone = dz;
        this.dropzone.removeAllFiles(true);
    },
    uploadCompleted(file, response, ev){
        if(!response){
            return;
        }

        let {processQueue, batchId} = this.state;
        const action = 'loaded';
        const filePayload = {
                             originalName: file.name, 
                             blobName: response.responseText,
                             lastModifiedDate: file.lastModified,
                             mimeType: file.type,
                             size: file.size,
                             width: file.width,
                             batchId: batchId
                            };

        processQueue.push(filePayload);
        this.setState({processQueue, action});
    },
    processImageQueue(){
        let {processQueue} = this.state;
        let processCount = processQueue.length;
        this.setState({action: 'processing'});
        Services.processImageQueue(processQueue, (error, response, body) => {
                if(!error && response.statusCode === 200) {
                    this.dropzone.removeAllFiles(true);
                    this.setState({processQueue: [], batchId: guid(), action: 'processed', processedCount: processCount});
                }else{
                    this.setState({processQueue: [], batchId: guid(), action: 'failed'});
                    console.error('An error occured pushing the queue messages');
                }
        });
    },
    uploadInterceptor(file, xhr, formData){
        const {batchId} = this.state;
        xhr.setRequestHeader("batchId", batchId);
    },
    render(){
        const eventHandlers = {
            init: this.initialize,
            complete: this.uploadCompleted,
            addedfile: this.fileAdded,
            sending: this.uploadInterceptor,
            removedfile: this.fileRemoved,
            success: this.uploadCompleted
        }

        const {action, processedCount, processQueue} = this.state;
        const className = action === 'processed' ? 'btn-success' : action === 'failed' ? 'btn-danger': 'btn-primary';
        const message = action === 'processed' ? 'Images Processed' : action === 'failed' ? 'Processing Failed': 'Process Images';

        return (
          <div>  
            <div className="col-lg-12 text-center ">
                  <DropzoneComponent config={componentConfig} 
                                     eventHandlers={eventHandlers} 
                                     djsConfig={djsConfig} />
            </div>
            <div className="col-lg-12 text-left">
                <div className="row" style={styles.button}>
                    <button type="button" onClick={this.processImageQueue} className={className + " btn"}>
                        {action === 'processing' ? <i className="fa fa-spinner fa-spin fa-fw"></i> : null} 
                        {message} &nbsp;
                        <span className="badge">{action === 'processed' ? processedCount : processQueue.length}</span>
                    </button>
                </div>
            </div>
          </div>
        );
    }
});