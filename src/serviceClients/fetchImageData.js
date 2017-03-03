import request from 'request';

export default {
    fecthRecentBatches(callback){
        let host = process.env.REACT_APP_SERVICE_HOST;
        let GET = {
            url: `${host}/api/fetchRecentBatches`,
            json: true,
            withCredentials: false
        };

        request(GET, callback);
    },
    fecthBatchImages(offset, limit, callback){
        let host = process.env.REACT_APP_SERVICE_HOST;
        let GET = {
            url: `${host}/api/fetchRecentImages?offset=${offset}&limit=${limit}`,
            json: true,
            withCredentials: false
        };

        request(GET, callback);
    }
};