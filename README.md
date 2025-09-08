<img width="1897" height="903" alt="image" src="https://github.com/user-attachments/assets/9349d169-6d71-440d-bb3d-e2a7fde19f04" />

# Career Compass

Career Compass is a smart job tracking and analytics application designed for **Data Analysts** and **Developers**.  
It combines **job matching algorithms**, **market analysis dashboards**, and **interactive career planning tools** to help users identify skill gaps, prioritize learning, and explore regional labor market trends.

---
##https://career-compass-frontend-hazel.vercel.app/

## Features

- **Job Matching Algorithm**  
  - NLP-based **n-gram analysis** for resume-to-job description matching  
  - Identifies missing and prioritized skills  
  - Provides personalized job recommendations  

- **Smart Recommendation System**  
  - Recommends jobs, learning paths, and certifications  
  - Adapts recommendations based on user history  

- **Data Pipeline**  
  - Ingestion of **ESCO** skill/occupation datasets  
  - Normalized storage in **PostgreSQL** via **Prisma ORM**  

- **Market Analysis Dashboard**  
  - Regional skill demand comparison  
  - Interactive **Power BI** visualizations  
  - Trends in skill growth/decay across industries  

- **Full-Stack Web Application**  
  - **Frontend**: React + Next.js with interactive charts  
  - **Backend**: Node.js + Express APIs  
  - **Database**: PostgreSQL (with Prisma ORM)  

---

## Tech Stack

- **Languages/Frameworks**: Python, Node.js, Express, Next.js, React  
- **Database/ORM**: PostgreSQL, Prisma  
- **Data Analysis**: Pandas
- **Visualization**: Power BI
- **NLP**: n-gram analysis for resume/job description similarity  
- **External APIs**: Rapid API, Jsearch API (job data ingestion)  

---
        
## Deployment
- **Frontend**: Vercel (Next.js React app)
- **Backend**: Render (Express + Node.js API)
- **Database**: PostgreSQL (Render)
- **Dashboards**: Power BI Service (embedded into frontend)

---

## NLP N-gram Algorithm
- Job descriptions and resumes are tokenized into n-grams (bigrams/trigrams).
-  Cosine similarity is computed between candidate resumes and job postings.
-  Matches are scored and ranked, highlighting skill gaps and priority areas.

## Future Improvements
- Deep learning models for semantic skill matching (e.g., BERT embeddings)
- Real-time labor market updates with streaming APIs
- User profile personalization with reinforcement learning
- Market Analysis Dashboard (skill decay/inflation)
- Company/Role-Level Analysis (clustering, NLP topic modeling)   
        


        


        
