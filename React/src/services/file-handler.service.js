import fileHttp from "../axios/file-http-common";
import authHeader from './auth-header';

class FileHandlerService {

    // get file list    
    getFileList() {
        return fileHttp.get("/getFiles", { headers: authHeader() });
    }
}

export default new FileHandlerService();