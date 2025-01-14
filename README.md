This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



























1. check tomorrow if you can npx prisma db push 
check your password in mongo db and check your env file


***Mongo db you have to make a cluster*** 
go to collections then create a database
make sure you get the password and write it down 
then get the connection string 
mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority
*** command *** 
npm install prisma --save-dev          ( if you havent already)
npx prisma init
** update your schema** 
npx prisma db push      ( to push the schema to the database/ dothis anytime you need to )

**note** it seems that is a folder structure refer to
https://stackoverflow.com/questions/72357417/next-auth-usesession-must-be-wrapped-in-a-sessionprovider-error-on-the 
// src/app/page.tsx
'use client';

import Footer from "./components/footer/page";
import Navbar from "./components/header/page";
import Hero from "./components/hero/hero";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

interface Props {
  session: Session | null;
}

const Home: React.FC<Props> = ({ session }) => {
  return (
    <SessionProvider session={session}>
      <ProtectedRoute>
        <div>
          <Navbar />
          <Hero />
          <Footer />
        </div>
      </ProtectedRoute>
    </SessionProvider>
  );
};

export default Home; 
the main issue was not using <protected route>
make sure you look into The difference between the two versions of page.tsx lies in the usage of the ProtectedRoute component. In the first version, the ProtectedRoute component is used to wrap the main content, ensuring that only authenticated users can access it. In the second version, the ProtectedRoute component is not used, which means that the main content is accessible to all users, regardless of their authentication status.



** note for monday** it seems that the form page has different parameters than the database something is not connecting. 


npx ts-node src/scripts/verify.ts



I had to change the  whole login config. Im no longer using the database for auth. Im using Oauth2 basically integrating it with pcrs system 

I have a form page that I want to take the registration number and the check number. C:\Users\Rolando\Desktop\portal-master\src\app\form\page.tsx
 The registration number will be send to a oauth api with the key that I got back when I logged in (this is already done). the response json payload should look like this. {
  "registers": [
    {
      "paymentMethodCode": "Check",
      "paymentMethodDescription": "Check",
      "number": "R20241107-14403551",
      "dealerNumber": "MS47",
      "amount": 435,
      "paymentDate": "2024-11-07",
      "referenceNumber": "",
      "remittanceCompany": {
        "code": "ENDUROCARE",
        "name": "EnduroCare Warranty Services, LLC",
        "type": "CashBalancing",
        "companyType": "Company"
      },
      "memo": "",
      "checkNumber": "",
      "contractPayments": [
        {
          "number": "R1248301",
          "bundleNumber": "",
          "alternateNumber": "",
          "payments": [],
          "customer": {
            "firstName": "XXXXXXXX",
            "lastName": "XXXXXXXX"
          },
          "contractRemit": {
            "amount": 145,
            "tax": {
              "taxAmount1": 0,
              "taxAmount2": 0
            },
            "amountWithTax": 145
          },
          "vehicle": {
            "vin": "2GCUDEED2R1248301",
            "properties": {
              "color": "",
              "isNitrogenInstalled": false
            },
            "make": "CHEVROLET",
            "model": "Silverado 1500 RST",
            "vehicleYear": 2024
          },
          "billedDate": "2024-11-07T00:00:00",
          "productType": "Limited Warranty"
        },
        {
          "number": "RZ385878",
          "bundleNumber": "",
          "alternateNumber": "",
          "payments": [],
          "customer": {
            "firstName": "XXXXXXXX",
            "lastName": "XXXXXXXX"
          },
          "contractRemit": {
            "amount": 145,
            "tax": {
              "taxAmount1": 0,
              "taxAmount2": 0
            },
            "amountWithTax": 145
          },
          "vehicle": {
            "vin": "1GCRDEED0RZ385878",
            "properties": {
              "color": "",
              "isNitrogenInstalled": false
            },
            "make": "CHEVROLET",
            "model": "Silverado 1500 RST",
            "vehicleYear": 2024
          },
          "billedDate": "2024-11-07T00:00:00",
          "productType": "Limited Warranty"
        },
        {
          "number": "SF135458",
          "bundleNumber": "",
          "alternateNumber": "",
          "payments": [],
          "customer": {
            "firstName": "XXXXXXXX",
            "lastName": "XXXXXXXX"
          },
          "contractRemit": {
            "amount": 145,
            "tax": {
              "taxAmount1": 0,
              "taxAmount2": 0
            },
            "amountWithTax": 145
          },
          "vehicle": {
            "vin": "1G1ZG5ST7SF135458",
            "properties": {
              "color": "",
              "isNitrogenInstalled": false
            },
            "make": "CHEVROLET",
            "model": "Malibu RS",
            "vehicleYear": 2025
          },
          "billedDate": "2024-11-07T00:00:00",
          "productType": "Limited Warranty"
        }
      ],
      "claimPayments": [],
      "adjustmentPayments": [],
      "payments": []
    }
  ],
  "totalRecordCount": 1,
  "correlationId": "c9a165b1-f1ce-46a8-b125-8f56cf0cc47d"
}

Will get MULTIPLE VIN NUMBER STORE IT THEN  SEND TO ANOTHER API 


IF ALL OF THEM 

"isFunded": false, THEN RETURN NOT FUNDED TO THE DATABASE. 
RETURN DEALER NAME  AND DEALER NUMBER TO THE DATABASE AND ACTIVATION DATE AS paid date. 
Entry date as the date this function was submitted.   

Check Deposited	Dealer Number	Dealer Name	Register Number	Amount	User Name	Check Number	Status	Entry Date	Paid Date

the only one left empty is check deposited. The id should be the register number. lets start with the login page to store the oauth2 key it seems that its completed but can you take a look ?#   p o r t a l 1  
 #   p o r t a l 1  
 