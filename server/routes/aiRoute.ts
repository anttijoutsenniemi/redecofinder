import express, { Request, Response } from 'express';
import { fetchInterPretationWithReference } from '../functions/visionHandler';

const aiRoute : express.Router = express.Router();

const validateAndProcessRequest = (req: Request, res: Response) : boolean => {
    let img64Array: string[] = req.body.img64Array;
    let userFilledData: string = req.body.userFilledData;
    
    // Check if img64Array is a valid array of strings
    if (!Array.isArray(img64Array) || !img64Array.every(item => typeof item === 'string')) {
      return false;
    }
    // Check if userFilledData is a non-empty string
    if (typeof userFilledData !== 'string' || userFilledData.trim() === '') {
      return false;
    }
    // Check that img64Array has fewer than 4 items
    if (img64Array.length >= 4) {
      return false;
    }
    // If all checks pass, execute the function
    return true
  };

aiRoute.get("/ref", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let img64Array : string[] = req.body.img64Array;
        let userFilledData : string = req.body.userFilledData;
        if(validateAndProcessRequest(req, res)){
            let aiJson = await fetchInterPretationWithReference(userFilledData, img64Array);
            res.status(200).json(JSON.stringify(aiJson));
        }
        else {
            res.status(404).json({ "error" : `invalid data format` });
        }

        
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

export default aiRoute;