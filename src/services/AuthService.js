import axios from "axios";

class AuthService{

    url = process.env.REACT_APP_API_URL;
    configMultipartData = {
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    }

    configJsonData = {
        headers:{
            'Content-Type': 'application/json'
        }
    }

    authMultiPart = {
        headers:{
            'Content-Type': 'multipart/form-data',
            'Authorization':'Bearer '+localStorage.getItem('accessToken')
        }
    }

    authConfigJsonData = {
        headers:{
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+localStorage.getItem('accessToken')
        }
    }

    constructor()
    {
        this.axiosInstance = axios.create();
        this.axiosInstance.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                if(error.response.status === 401 && !originalRequest._retry){
                    originalRequest._retry = true;
                    try{
                        //if refresh token is not expired
                        // await this.refreshToken();
                        const newAccessToken = localStorage.getItem('accessToken');
                        originalRequest.headers['Authorization'] = 'Bearer '+newAccessToken;
                        return this.axiosInstance(originalRequest);
                    }
                    catch(e){
                        //refresh token also expired
                        this.logoutUser();
                        window.location.href = '/login';
                        return Promise.reject(e);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    async refreshToken()
    {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const authorizationHeader = {
            headers:{
                'Authorization':'Bearer '+storedRefreshToken
            }
        }
        const response = await axios.get(this.url+'refresh-token', authorizationHeader);
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    }

    register(formData){
        return axios.post(this.url+'register', formData, this.configMultipartData);
    }

    login(formData){
        return axios.post(this.url+'login', formData, this.configJsonData);
    }

    forgotPassword(formData){
        return axios.post(this.url+'forgot-password', formData, this.configJsonData);
    }

    loginUser(data){
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("tokenType", data.tokenType);
        localStorage.setItem("user", JSON.stringify(data.data));
    }

    logoutUser()
    {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('user');
    }

    isLoggedIn()
    {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    getUserData()
    {
        return JSON.parse(localStorage.getItem('user'));
    }

    setUserData(userData)
    {
        localStorage.setItem("user", JSON.stringify(userData));
    }

    createBot(formData){
        return this.axiosInstance.post(this.url+'admin/add-chat-bot', formData, this.authMultiPart);
    }

    updateBot(formData){
        return this.axiosInstance.put(this.url+'admin/update-chat-bot', formData, this.authMultiPart);
    }

    getBots(){
        return this.axiosInstance.get(this.url+'admin/chat-bots', this.authConfigJsonData);
    }

    deleteBot(data){
        return this.axiosInstance.delete(this.url+'admin/delete-chat-bot', {
            data: data,
            ...this.authConfigJsonData
        });
    }

    getUBots(){
        return this.axiosInstance.get(this.url+'chat-bots', this.authConfigJsonData);
    }

    getBot(id){
        return this.axiosInstance.get(this.url+'chat-bots?id='+id, this.authConfigJsonData);
    }

    sendMessage(formData){
        return this.axiosInstance.post(this.url+'send-message', formData, this.authConfigJsonData);
    }

    generateImage(formData){
        return this.axiosInstance.post(this.url+'image-generate', formData, this.authConfigJsonData);
    }

    getConversations(id){
        return this.axiosInstance.get(this.url+'conversations?chat_bot_id='+id, this.authConfigJsonData);
    }

    getConversationMessages(id){
        return this.axiosInstance.get(this.url+'get-messages?conversation_id='+id, this.authConfigJsonData);
    }

    getImages(id){
        return this.axiosInstance.get(this.url+'get-images?chat_bot_id='+id, this.authConfigJsonData);
    }

    deleteImage(formData){
        return this.axiosInstance.delete(this.url+'image', {
            data: formData,
            ...this.authConfigJsonData
        });
    }

    textToSpeech(formData){
        return this.axiosInstance.post(this.url+'text-to-speech', formData, this.authConfigJsonData);
    }

    getTTSList(){
        return this.axiosInstance.get(this.url+'text-to-speech', this.authConfigJsonData);
    }

    deleteTTS(formData){
        return this.axiosInstance.delete(this.url+'text-to-speech', {
            data: formData,
            ...this.authConfigJsonData
        });
    }

    speechToText(formData){
        return this.axiosInstance.post(this.url+'speech-to-text', formData, this.authMultiPart);
    }

    getSTTList(){
        return this.axiosInstance.get(this.url+'speech-to-text', this.authConfigJsonData);
    }

    deleteSTT(formData){
        return this.axiosInstance.delete(this.url+'speech-to-text', {
            data: formData,
            ...this.authConfigJsonData
        });
    }

    imageRecognition(formData){
        return this.axiosInstance.post(this.url+'image-recognition', formData, this.authMultiPart);
    }

    getImageRecognition(){
        return this.axiosInstance.get(this.url+'image-recognition', this.authConfigJsonData);
    }

    deleteImageRecognition(formData){
        return this.axiosInstance.delete(this.url+'image-recognition', {
            data: formData,
            ...this.authConfigJsonData
        });
    }

    singlePDFUpload(formData){
        return this.axiosInstance.post(this.url+'pdf', formData, this.authMultiPart);
    }

    getPDFs(){
        return this.axiosInstance.get(this.url+'pdf', this.authConfigJsonData);
    }

    chatWithPdf(formData){
        return this.axiosInstance.post(this.url+'chat-with-pdf', formData, this.authConfigJsonData);
    }

    getSinglePDFChats(pdf_id){
        return this.axiosInstance.get(this.url+'single-pdf-chats?pdf_id='+pdf_id, this.authConfigJsonData);
    }

    multiplePDFUpload(formData){
        return this.axiosInstance.post(this.url+'pdfs', formData, this.authMultiPart);
    }

    getMultiplePdf(){
        return this.axiosInstance.get(this.url+'pdfs', this.authConfigJsonData);
    }

    updateEmbedding(formData){
        return this.axiosInstance.put(this.url+'update-chunk', formData, this.authConfigJsonData);
    }

    deleteEmbedding(formData){
        return this.axiosInstance.delete(this.url+'delete-pdf-data', {
            data: formData,
            ...this.authConfigJsonData
        });
    }

    getPDFConversations(){
        return this.axiosInstance.get(this.url+'pdf-conversations', this.authConfigJsonData);
    }

    getPDFConversationMessages(id){
        return this.axiosInstance.get(this.url+'pdf-conversation-messages?conversation_id='+id, this.authConfigJsonData);
    }

    askQuestionWithPDFs(formData){
        return this.axiosInstance.post(this.url+'chat-with-multiple-pdf', formData, this.authConfigJsonData);
    }

}

export default new AuthService();