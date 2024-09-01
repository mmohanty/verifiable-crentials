
//https://www.npmjs.com/package/@web5/credentials
//https://www.w3.org/TR/vc-data-model-2.0/

// TS in Node
//https://debugmode.net/2019/12/31/step-by-step-using-typescript-in-node-js-application/

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


import { VerifiableCredential, VerifiablePresentation, PresentationExchange } from '@web5/credentials';
import { BearerDid, DidJwk } from '@web5/dids';
import { LocalKeyManager } from '@web5/crypto';



const app = express();
app.use(express.json());
const PORT = 9000;


app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});



class DrivingLicense {
  name: string;
  dob: string;
  address: string;
  expiryDate: string;

  constructor(name, dob, address, expiryDate) {
      this.name = name;
      this.dob = dob;
      this.address = address;
      this.expiryDate = expiryDate;
  }

}

const keyManager = new LocalKeyManager();

app.get("/status", (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    const status = {
        Status: "Node Code Running",
    };
    response.send(status);
});


app.post("/issue-new-credentials", async (request, response) => {

    response.setHeader('Content-Type', 'application/json');
    const body = request.body;
    console.log(body);

    const issuer: BearerDid = await DidJwk.create({ keyManager });

    const drivingLicense: DrivingLicense = new DrivingLicense(body.name, body.dob, body.address,body.expiryDate);
    const vc: VerifiableCredential = await VerifiableCredential.create({
        type: body.credentialType,
        issuer: issuer.uri,
        subject: "did:example:subject",
        data: drivingLicense
    });


    console.log("Issuer Docs");
    console.log(issuer.uri);

    const signedVcJwt: string = await vc.sign({ did: issuer });

    console.log(signedVcJwt);
    response.send({"signedVcJwt":signedVcJwt});
});


app.post("/verify-credentials", async (request, response) => {

  response.setHeader('Content-Type', 'application/json');
  const body = request.body;
  console.log(body);

  console.log(body.signedVcJwt);
    try {
        await VerifiableCredential.verify({ vcJwt: body.signedVcJwt })
        console.log("VC Verification successful!");
        return response.send({"status": "Success","message":"VC Verification successful!"});
    } catch (e: any) {
        console.log("VC Verification failed:" + e.message);
        return response.send({"status": "Failed", "message":"VC Verification failed:" + e.message});
    }
});



app.post("/parse-credentials", async (request, response) => {

  response.setHeader('Content-Type', 'application/json');
  const body = request.body;
  console.log(body);

  const vc1: VerifiableCredential = VerifiableCredential.parseJwt({ vcJwt: body.signedVcJwt })
  response.send({"vc": vc1});
});






// async function issueNewCredential() {


//     const issuer: BearerDid = await DidJwk.create({ keyManager });

//     const drivingLicense: DrivingLicense = new DrivingLicense("Manas Mohanty", "01/01/2000", "123 Main Street", "01/01/2025");
//     const vc: VerifiableCredential = await VerifiableCredential.create({
//         type: "DrivingLicense",
//         issuer: issuer.uri,
//         subject: "did:example:subject",
//         // data: new StreetCredibility("high", true)
//         data: drivingLicense
//     });



//     console.log("Issuer Docs");
//     console.log(issuer.uri);

//     const signedVcJwt: string = await vc.sign({ did: issuer });

//     console.log(signedVcJwt);
//     try {
//         await VerifiableCredential.verify({ vcJwt: signedVcJwt })
//         console.log("VC Verification successful!")
//     } catch (e: any) {
//         console.log("VC Verification failed:" + e.message);
//     }

//     const vc1: VerifiableCredential = VerifiableCredential.parseJwt({ vcJwt: signedVcJwt })


//     console.log("VerifiableCredential");

//     console.log(vc1);
// }