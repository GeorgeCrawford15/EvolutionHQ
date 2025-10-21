# EvolutionHQ

**A web-based tool for high school students learning the fundamentals of evolution.**

[Check Out EvolutionHQ](https://www.evolutionhq.org)

---

## Overview

**EvolutionHQ** is an interactive educational web application that helps students explore genetics and evolution. It allows users to perform monohybrid and dihybrid crosses, generating offspring combinations with genotypic and phenotypic ratios, while providing smooth frontend animations. Beyond genetics, users can create a matrix table from inputted or uploaded CSV data to analyze species relationships, automatically generate a phylogenetic tree highlighting species of interest, and explore evolution through an educational page with checkpoint questions to reinforce learning.

The project combines a **modern frontend** (HTML, CSS, JavaScript) with a **Python Flask backend** to calculate Punnett square outcomes dynamically. This makes the learning experience interactive and immediately responsive.

---

## Features

- **Monohybrid Cross Calculator**  
  - Input two single-gene genotypes and get all possible offspring.  
  - See both **genotypic and phenotypic ratios**.  

- **Dihybrid Cross Calculator**  
  - Input two two-gene genotypes for a more complex cross.  
  - Displays offspring in a Punnett square format with ratios.  

- **Matrix Table**
  - Input or upload data from a CSV file.
  - Generates insights about most closely related species.

- **Phylogenetic Tree Generator**
  - Created automatically based on information from the matrix table.
  - Highlights species of interest and can be downloaded.

- **Evolution Educational Page**
  - Provides clear and concise information about evolution.
  - Includes checkpoint questions to ensure students' comprehension.

- **Interactive Frontend**  
  - Smooth animations for showing offspring cells.  
  - Toggle between monohybrid and dihybrid cross sections.  

- **Production-ready API**  
  - Flask backend hosted on [Render](https://render.com) for dynamic calculations.  
  - Frontend hosted on [Vercel](https://vercel.com) for fast, static delivery.  

---

## Tech Stack

| Layer           | Technology                 |
|-----------------|----------------------------|
| Frontend        | HTML, CSS, JavaScript      |
| Backend         | Python, Flask              |
| Hosting         | Vercel (frontend), Render (backend) |
| CORS Management | `flask-cors`               |