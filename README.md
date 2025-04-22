# GuardPoint - Cybersecurity Awareness Tool

GuardPoint is an interactive cybersecurity training platform developed as part of a university final year project. It focuses on three core areas of user security awareness:

- **Password Security**
- **Phishing Email Detection**
- **Safe Web Browsing**

## 💡 Purpose

GuardPoint is designed to educate users about common security risks through interactive and engaging tasks. It aligns with NCSC guidance, ISO 27001 recommendations, and gamified learning principles.

## ✨ Features

- **Password Task**:  
  Users test their passwords against real-world breach data (using the Have I Been Pwned API) and learn how to create strong, non-dictionary passwords.

- **Phishing Task**:  
  Simulated emails allow users to practice identifying suspicious elements. Includes classification of email types: Deceptive, Spear, Clone, or Safe.

- **Safe Web Browsing Task**:  
  A search engine simulation where users identify dangerous links. Features include three difficulty levels and a 30-second timed mode.

- **Admin Dashboard**:  
  Admins can log in to track users by organisation, view task completion status and reset tasks or quiz.

## 🧱 Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Testing**: Vitest, Supertest
- **External APIs**: Have I Been Pwned API, OpenAI



