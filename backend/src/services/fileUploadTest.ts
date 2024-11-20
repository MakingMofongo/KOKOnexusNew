import { VapiClient } from "@vapi-ai/server-sdk";
import * as fs from "fs";

const client = new VapiClient({ token: '5ff9ceba-2569-4386-bb11-d8d9bf1c1f2a' });

// Create a ReadStream with the correct MIME type
const fileStream = fs.createReadStream("C:/Users/moham/Documents/GitHub/KOKOnexusNew/backend/src/services/trial.txt", {
  encoding: 'utf8'
});

// Set the content type explicitly
(fileStream as any).contentType = 'text/plain';

// Upload the file with the correct MIME type
client.files.create(fileStream);



// import { VapiClient } from "@vapi/server-sdk";

// const client = new VapiClient({ token: "5ff9ceba-2569-4386-bb11-d8d9bf1c1f2a" });        
// await client.files.create(
	
// )



