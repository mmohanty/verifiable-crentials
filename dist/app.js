"use strict";
//https://www.npmjs.com/package/@web5/credentials
//https://www.w3.org/TR/vc-data-model-2.0/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const credentials_1 = require("@web5/credentials");
const dids_1 = require("@web5/dids");
const crypto_1 = require("@web5/crypto");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 9000;
app.use((0, cors_1.default)());
// Configuring body parser middleware
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
class DrivingLicense {
    constructor(name, dob, address, expiryDate) {
        this.name = name;
        this.dob = dob;
        this.address = address;
        this.expiryDate = expiryDate;
    }
}
const keyManager = new crypto_1.LocalKeyManager();
app.get("/status", (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    const status = {
        Status: "Node Code Running",
    };
    response.send(status);
});
app.post("/issue-new-credentials", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    response.setHeader('Content-Type', 'application/json');
    const body = request.body;
    console.log(body);
    const issuer = yield dids_1.DidJwk.create({ keyManager });
    const drivingLicense = new DrivingLicense(body.name, body.dob, body.address, body.expiryDate);
    const vc = yield credentials_1.VerifiableCredential.create({
        type: body.credentialType,
        issuer: issuer.uri,
        subject: "did:example:subject",
        data: drivingLicense
    });
    console.log("Issuer Docs");
    console.log(issuer.uri);
    const signedVcJwt = yield vc.sign({ did: issuer });
    console.log(signedVcJwt);
    response.send({ "signedVcJwt": signedVcJwt });
}));
app.post("/verify-credentials", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    response.setHeader('Content-Type', 'application/json');
    const body = request.body;
    console.log(body);
    console.log(body.signedVcJwt);
    try {
        yield credentials_1.VerifiableCredential.verify({ vcJwt: body.signedVcJwt });
        console.log("VC Verification successful!");
        return response.send({ "status": "Success", "message": "VC Verification successful!" });
    }
    catch (e) {
        console.log("VC Verification failed:" + e.message);
        return response.send({ "status": "Failed", "message": "VC Verification failed:" + e.message });
    }
}));
app.post("/parse-credentials", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    response.setHeader('Content-Type', 'application/json');
    const body = request.body;
    console.log(body);
    const vc1 = credentials_1.VerifiableCredential.parseJwt({ vcJwt: body.signedVcJwt });
    response.send({ "vc": vc1 });
}));
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
//# sourceMappingURL=app.js.map