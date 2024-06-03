import express from 'express';

const apiRoute : express.Router = express.Router();

apiRoute.get("/", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        res.status(200).json({ "message" : "apiroute initialized"});
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

export default apiRoute;