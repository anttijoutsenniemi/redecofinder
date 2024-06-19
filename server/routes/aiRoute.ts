import express from 'express';

const aiRoute : express.Router = express.Router();

aiRoute.get("/ref", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        //here get ref image and send back style json
        res.status(200).json({ "message" : "aiRoute initialized"});
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

export default aiRoute;