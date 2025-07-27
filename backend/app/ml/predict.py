import pandas as pd
import joblib
from pathlib import Path

model_path = Path(__file__).parent / 'model.pkl'
model = joblib.load(model_path)

def predict_loan_risk(input_data: dict) -> float:
    df = pd.DataFrame([input_data])
    risk = model.predict_proba(df)[:, 1][0]
    return float(risk)