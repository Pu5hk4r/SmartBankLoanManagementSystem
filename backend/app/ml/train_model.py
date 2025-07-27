import pandas as pd
from datasets import load_dataset
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

# Load dataset
ds = load_dataset("VerisimilitudeX/BankLoanSafety")
df = pd.DataFrame(ds['train'])  # Assume 'train' split

# Preprocess target (binary: 1 if 'Charged Off', else 0)
df['target'] = (df['loan_status'] == 'Charged Off').astype(int)

# Features (match dataset and user suggestion)
numeric_features = ['loan_amnt', 'annual_inc', 'dti', 'delinq_2yrs', 'inq_last_6mths', 'int_rate', 'installment']
categorical_features = ['emp_length', 'home_ownership', 'purpose', 'grade', 'term']

X = df[numeric_features + categorical_features]
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('num', 'passthrough', numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# Pipeline
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(max_iter=1000))
])

model.fit(X_train, y_train)

# Evaluate
print("Test accuracy:", model.score(X_test, y_test))

# Save
joblib.dump(model, 'app/ml/model.pkl')
print("Model saved to app/ml/model.pkl")