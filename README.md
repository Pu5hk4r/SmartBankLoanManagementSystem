# Smart Bank Loan Management & Risk Prediction System

A full-stack application for bank loan applications, risk prediction using ML, and admin management.

## Features
- User registration/login with JWT auth and roles (user/admin).
- Loan application form with real-time installment/interest calculation.
- Admin dashboard for approving/rejecting loans, viewing stats and risk predictions.
- ML-based default risk prediction using Logistic Regression on the BankLoanSafety dataset.
- Basic loan monitoring in user dashboard.
- Visualizations in admin (e.g., loan status pie chart).
- Dockerized for easy deployment.

## Tech Stack
- Backend: FastAPI, SQLAlchemy, PostgreSQL, Alembic, scikit-learn.
- Frontend: React (Vite), Axios, Formik+Yup, Recharts, Material-UI.
- ML: Trained on https://huggingface.co/datasets/VerisimilitudeX/BankLoanSafety (target: binary from loan_status).

## Installation
1. Clone repo and create directories as per structure.
2. Backend: `cd backend && pip install -r requirements.txt`.
3. Train ML model: `python app/ml/train_model.py` (generates model.pkl).
4. Setup DB: Update .env with DATABASE_URL. Run `alembic init app/db/migrations`, then in alembic/env.py add `from app.db.base import Base; target_metadata = Base.metadata` and `from app.db.models import *`. Then `alembic revision --autogenerate -m "initial"` and `alembic upgrade head`.
5. Run backend: `uvicorn app.main:app --reload`.
6. Frontend: `cd frontend && npm install && npm run dev`.
7. Docker: `docker-compose up --build`.
8. Access: Frontend at http://localhost:3000, Backend API at http://localhost:8000/docs.

## Training the Model
The dataset is loaded from Hugging Face. Customize features in train_model.py if needed.

## License
MIT