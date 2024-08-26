import express from 'express';
import { scrapeWebsite } from '../functions/webScraping';
import furnitureModel from '../dbModels/furnitureModel';
import { scrapeAndMakeAiData } from '../functions/scheduledFunctions';
import parameterLibrary from './../styleJson/parameterLibrary.json';

const apiRoute : express.Router = express.Router();

const chairModule = furnitureModel('chairs');
const sofaModule = furnitureModel('sofas');
const storageModule = furnitureModel('storage');
const tableModule = furnitureModel('tables');
const conferenceModule = furnitureModel('conference');

apiRoute.get("/", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        res.status(200).json({ "message" : "apiroute initialized"});
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

apiRoute.post("/furnitureCategory", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let category : string = req.body.category;
        if(parameterLibrary.includes(category)){
            let data = await furnitureModel(category).fetchData();
            res.status(200).json(data);
        }
        else{
            res.status(404).json({ "error" : `invalid data` });
        }
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

apiRoute.get("/testScraping", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
                   /* 
            Here we start with categories: 
            1. Chairs = työtuolit + neuvottelu-asiakastauolit
            2. Sofas, armchairs and stools = sohvat, nojatuolit ja rahit
            3. Storage furniture = säilytyskalusteet
            4. Tables = sohva ja pikkupöydät + sähköpöydät + työpöydät + neuvottelupöydät
            5. Conference sets = neuvotteluryhmät
            */
        //let automaticScraping = await scrapeAndMakeAiData();
        res.status(200).json({ "message" : "apiroute initialized"});
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

export default apiRoute;