1.	/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Shao Qiao Student ID: 145954210 Date: 2023-9-15
*  Cyclic Link:https://shy-cyan-coypu-cuff.cyclic.app 
*
********************************************************************************/ 

// Setup
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better
app.use(cors());
app.use(express.json());
require('dotenv').config();

const CompaniesDB = require("./modules/companiesDB.js");
const db = new CompaniesDB();

let MONGODB_CONN_STRING="mongodb+srv://dbuser:65QctrTe.93aFxk@cluster0.k4yjgtq.mongodb.net/sample_training";
// Add support for incoming JSON entities
app.use(bodyParser.json());

// Deliver the app's home page to browser clients
app.get('/', (req, res) => {
 //res.json({message: "API Listening"});
  res.sendFile(path.join(__dirname, '/index.html'));
});

// POST /api/companies
app.post("/api/companies", async (req, res) => {
  try {
    const newCompany = await db.addNewCompany(req.body);
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/companies
app.get("/api/companies", async (req, res) => {
  const { page, perPage, tag } = req.query;

  try {
    const companies = await db.getAllCompanies(page, perPage, tag);
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/company/:name
app.get("/api/company/:name", async (req, res) => {
  const companyName = req.params.name;

  try {
    const company = await db.getCompanyByName(companyName);
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/company/:name
app.put("/api/company/:name", async (req, res) => {
  const companyName = req.params.name;
  const updatedData = req.body;

  try {
    const result = await db.updateCompanyByName(updatedData, companyName);
    if (result.nModified === 1) {
      res.json({ message: "Company updated successfully" });
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/company/:name
app.delete("/api/company/:name", async (req, res) => {
  const companyName = req.params.name;

  try {
    const result = await db.deleteCompanyByName(companyName);
    if (result.deletedCount === 1) {
      res.json({ message: "Company deleted successfully" });
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res) => {
    res.status(404).send('Resource not found');
  });

  //db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
     db.initialize(MONGODB_CONN_STRING).then(()=>{
      app.listen(HTTP_PORT, ()=>{
          console.log(`server listening on: ${HTTP_PORT}`);
      });
    }).catch((err)=>{
      console.log(err);
    });
