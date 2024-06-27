import express from 'express';
import { fetchInterPretationWithReference } from '../functions/visionHandler';

const aiRoute : express.Router = express.Router();

aiRoute.get("/ref", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let img64Array : string[] = req.body.img64Array;
        let userFilledData : string = req.body.userFilledData;
        //here get ref image and send back style json
        res.status(200).json({ "message" : "aiRoute initialized"});
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

export default aiRoute;