Resume Builder
Overview

Resume Builder is a full-stack web application that allows users to create, customize, and download professional resumes. The platform provides multiple resume templates, an easy-to-use interface, and PDF generation functionality to help users build ATS-friendly resumes efficiently.

Features
User-friendly resume creation interface
Multiple professional resume templates
Add and manage:
Personal Information
Education Details
Work Experience
Projects
Skills
Certifications
Real-time resume preview
Download resume as PDF
Responsive design for desktop and mobile devices
Secure backend APIs
Easy customization and editing
Tech Stack
Frontend
React.js
Tailwind CSS
Axios
Backend
Java
Spring Boot
Spring Data JPA
REST API
Database
MySQL
Tools & Technologies
Maven
Git & GitHub
Postman
IntelliJ IDEA
System Architecture
Frontend (React + Tailwind)
            |
            v
     REST APIs
            |
            v
 Backend (Spring Boot)
            |
            v
      MySQL Database
Project Structure
resume-builder
│
├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   └── templates
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   └── dto
│
└── database
Key Functionalities
Resume Management
Create new resumes
Edit existing resumes
Delete resumes
View saved resumes
Template Selection
Choose from multiple resume templates
Customize resume appearance
PDF Export
Generate professional PDF resumes
Download resumes instantly
Future Enhancements
User Authentication with JWT
Resume Sharing via Public Links
AI-Powered Resume Suggestions
Cover Letter Generator
Premium Resume Templates
Cloud Storage Integration
Razorpay Payment Gateway Integration
Installation
Clone Repository
git clone https://github.com/your-username/resume-builder.git
Backend Setup
cd backend

mvn clean install

mvn spring-boot:run
Frontend Setup
cd frontend

npm install

npm run dev
API Endpoints
Method	Endpoint	Description
POST	/resume	Create Resume
GET	/resume/{id}	Get Resume
PUT	/resume/{id}	Update Resume
DELETE	/resume/{id}	Delete Resume
Learning Outcomes

Through this project, I gained hands-on experience with:

Full Stack Development
Spring Boot REST APIs
React Component-Based Architecture
Database Design using MySQL
API Integration
PDF Generation
Git & GitHub Version Control
Author

Shrestha Bhatnagar

LinkedIn: https://www.linkedin.com/in/shrestha008
GitHub: https://github.com/shreshtabhatnagar-max
