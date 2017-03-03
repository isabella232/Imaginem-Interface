import request from 'request';

export default {
    processImageQueue(inputImageQueue, callback){
        let host = process.env.REACT_APP_SERVICE_HOST;
        let POST = {
            url: `${host}/api/processQueue`,
            method: "POST",
            json: true,
            withCredentials: false,
            body: { inputImageQueue }
        };

        request(POST, callback);
    }
};