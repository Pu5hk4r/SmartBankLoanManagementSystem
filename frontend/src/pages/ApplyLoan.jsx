import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Container,
  Box,
  Paper,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const gradeToRate = {
  A: 0.06,
  B: 0.1,
  C: 0.15,
  D: 0.2,
  E: 0.25,
  F: 0.3,
  G: 0.35,
};

const validationSchema = Yup.object({
  term: Yup.string().required('Required'),
  grade: Yup.string().required('Required'),
  amount: Yup.number().min(0, 'Must be positive').required('Required'),
  home_ownership: Yup.string().required('Required'),
  annual_inc: Yup.number().min(0, 'Must be positive').required('Required'),
  dti: Yup.number().min(0).required('Required'),
  delinq_2yrs: Yup.number().min(0).integer().required('Required'),
  inq_last_6mths: Yup.number().min(0).integer().required('Required'),
  purpose: Yup.string().required('Required'),
  emp_length: Yup.string().required('Required'),
});

const calculateInstallment = (amount, rate, months) => {
  const monthlyRate = rate / 12;
  return (
    (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
};

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [calculatedInstallment, setCalculatedInstallment] = useState(0);
  const [calculatedRate, setCalculatedRate] = useState(0);

  const formik = useFormik({
    initialValues: {
      term: '',
      grade: '',
      amount: '',
      home_ownership: '',
      annual_inc: '',
      dti: '',
      delinq_2yrs: '',
      inq_last_6mths: '',
      purpose: '',
      emp_length: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const rate = gradeToRate[values.grade];
        const months = parseInt(values.term.split(' ')[0]);
        const amount = parseFloat(values.amount);
        const installment = calculateInstallment(amount, rate, months);

        const payload = {
          ...values,
          amount,
          annual_inc: parseFloat(values.annual_inc),
          dti: parseFloat(values.dti),
          delinq_2yrs: parseInt(values.delinq_2yrs),
          inq_last_6mths: parseInt(values.inq_last_6mths),
          int_rate: rate,
          installment,
        };

        await api.post('/api/v1/loans/apply', payload);
        navigate('/dashboard');
      } catch (error) {
        console.error('Loan submission failed:', error);
        alert("Error applying for loan. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);

    const values = { ...formik.values, [name]: value };
    const rate = gradeToRate[values.grade] || 0;
    const months = parseInt(values.term?.split(' ')[0] || 0);
    const amount = parseFloat(values.amount) || 0;

    if (amount > 0 && months && rate) {
      const installment = calculateInstallment(amount, rate, months);
      setCalculatedInstallment(installment.toFixed(2));
      setCalculatedRate((rate * 100).toFixed(2));
    } else {
      setCalculatedInstallment(0);
      setCalculatedRate(0);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Apply for Loan
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Term */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Term</InputLabel>
                <Select
                  name="term"
                  value={formik.values.term}
                  onChange={handleChange}
                  error={formik.touched.term && Boolean(formik.errors.term)}
                >
                  <MenuItem value="36 months">36 months</MenuItem>
                  <MenuItem value="60 months">60 months</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Grade */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Grade</InputLabel>
                <Select
                  name="grade"
                  value={formik.values.grade}
                  onChange={handleChange}
                  error={formik.touched.grade && Boolean(formik.errors.grade)}
                >
                  {Object.keys(gradeToRate).map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Amount */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Loan Amount"
                name="amount"
                type="number"
                value={formik.values.amount}
                onChange={handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </Grid>

            {/* Annual Income */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Annual Income"
                name="annual_inc"
                type="number"
                value={formik.values.annual_inc}
                onChange={handleChange}
                error={formik.touched.annual_inc && Boolean(formik.errors.annual_inc)}
                helperText={formik.touched.annual_inc && formik.errors.annual_inc}
              />
            </Grid>

            {/* DTI */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="DTI (Debt-to-Income)"
                name="dti"
                type="number"
                value={formik.values.dti}
                onChange={handleChange}
                error={formik.touched.dti && Boolean(formik.errors.dti)}
                helperText={formik.touched.dti && formik.errors.dti}
              />
            </Grid>

            {/* Delinquencies */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Delinquencies (last 2 yrs)"
                name="delinq_2yrs"
                type="number"
                value={formik.values.delinq_2yrs}
                onChange={handleChange}
                error={formik.touched.delinq_2yrs && Boolean(formik.errors.delinq_2yrs)}
                helperText={formik.touched.delinq_2yrs && formik.errors.delinq_2yrs}
              />
            </Grid>

            {/* Inquiries */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Inquiries (last 6 months)"
                name="inq_last_6mths"
                type="number"
                value={formik.values.inq_last_6mths}
                onChange={handleChange}
                error={formik.touched.inq_last_6mths && Boolean(formik.errors.inq_last_6mths)}
                helperText={formik.touched.inq_last_6mths && formik.errors.inq_last_6mths}
              />
            </Grid>

            {/* Purpose */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Purpose"
                name="purpose"
                value={formik.values.purpose}
                onChange={handleChange}
                error={formik.touched.purpose && Boolean(formik.errors.purpose)}
                helperText={formik.touched.purpose && formik.errors.purpose}
              />
            </Grid>

            {/* Employment Length */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employment Length (e.g. 2 years)"
                name="emp_length"
                value={formik.values.emp_length}
                onChange={handleChange}
                error={formik.touched.emp_length && Boolean(formik.errors.emp_length)}
                helperText={formik.touched.emp_length && formik.errors.emp_length}
              />
            </Grid>

            {/* Home Ownership */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Home Ownership</InputLabel>
                <Select
                  name="home_ownership"
                  value={formik.values.home_ownership}
                  onChange={handleChange}
                  error={formik.touched.home_ownership && Boolean(formik.errors.home_ownership)}
                >
                  <MenuItem value="OWN">OWN</MenuItem>
                  <MenuItem value="RENT">RENT</MenuItem>
                  <MenuItem value="MORTGAGE">MORTGAGE</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Monthly Info */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Monthly Installment: ${calculatedInstallment}
              </Typography>
              <Typography variant="subtitle1">
                Interest Rate: {calculatedRate}%
              </Typography>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Applying...' : 'Apply'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ApplyLoan;


// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Card, CardContent, Typography, Grid, Box } from '@mui/material';
// import api from '../api/axios';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';


// const LoanSchema = Yup.object().shape({
//   amount: Yup.number().required('Required'),
//   term: Yup.string().oneOf(['36 months', '60 months']).required('Required'),
//   annual_inc: Yup.number().required('Required'),
//   purpose: Yup.string().required('Required'),
//   grade: Yup.string().oneOf(['A', 'B', 'C', 'D', 'E', 'F', 'G']).required('Required'),
//   dti: Yup.number().required('Required'),
//   emp_length: Yup.string().required('Required'),
//   home_ownership: Yup.string().oneOf(['OWN', 'RENT', 'MORTGAGE']).required('Required'),
//   delinq_2yrs: Yup.number().required('Required'),
//   inq_last_6mths: Yup.number().required('Required'),
// });

// const gradeToRate = { A: 0.05, B: 0.08, C: 0.10, D: 0.12, E: 0.15, F: 0.18, G: 0.20 };

// const calculateInstallment = (amount, rate, termMonths) => {
//   const monthlyRate = rate / 12;
//   return (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
// };

// const ApplyLoan = () => {
//   const navigate = useNavigate();
//   const [calculatedInstallment, setCalculatedInstallment] = useState(0);
//   const [calculatedRate, setCalculatedRate] = useState(0);

//   const formik = useFormik({
//     initialValues: {
//       amount: '',
//       term: '36 months',
//       annual_inc: '',
//       purpose: '',
//       grade: 'A',
//       dti: '',
//       emp_length: '',
//       home_ownership: 'OWN',
//       delinq_2yrs: 0,
//       inq_last_6mths: 0,
//     },
//     validationSchema: LoanSchema,
//     onSubmit: async (values) => {
//       values.int_rate = gradeToRate[values.grade];
//       values.installment = calculateInstallment(values.amount, values.int_rate, parseInt(values.term.split(' ')[0]));
//       await api.post('/api/v1/loans/apply', values);
//       navigate('/dashboard');
//     },
//   });

//   const handleChange = (e) => {
//     formik.handleChange(e);
//     const values = { ...formik.values, [e.target.name]: e.target.value };
//     const rate = gradeToRate[values.grade] || 0;
//     const termMonths = parseInt(values.term?.split(' ')[0] || 36);
//     const installment = calculateInstallment(values.amount || 0, rate, termMonths);
//     setCalculatedRate(rate * 100);
//     setCalculatedInstallment(installment.toFixed(2));
//   };

//   return (
//     <Container maxWidth="md" style={{ marginTop: '50px' }}>
//       <Card>
//         <CardContent>
//           <Typography variant="h5" gutterBottom>Apply for a Loan</Typography>
//           <form onSubmit={formik.handleSubmit}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   name="amount"
//                   label="Loan Amount ($)"
//                   type="number"
//                   value={formik.values.amount}
//                   onChange={handleChange}
//                   error={formik.touched.amount && Boolean(formik.errors.amount)}
//                   helperText={formik.touched.amount && formik.errors.amount}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Term</InputLabel>
//                   <Select name="term" value={formik.values.term} onChange={handleChange}>
//                     <MenuItem value="36 months">36 months</MenuItem>
//                     <MenuItem value="60 months">60 months</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   name="annual_inc"
//                   label="Annual Income ($)"
//                   type="number"
//                   value={formik.values.annual_inc}
//                   onChange={handleChange}
//                   error={formik.touched.annual_inc && Boolean(formik.errors.annual_inc)}
//                   helperText={formik.touched.annual_inc && formik.errors.annual_inc}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   name="purpose"
//                   label="Purpose"
//                   value={formik.values.purpose}
//                   onChange={handleChange}
//                   error={formik.touched.purpose && Boolean(formik.errors.purpose)}
//                   helperText={formik.touched.purpose && formik.errors.purpose}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Grade</InputLabel>
//                   <Select name="grade" value={formik.values.grade} onChange={handleChange}>
//                     {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(g => (
//                       <MenuItem key={g} value={g}>{g}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   name="dti"
//                   label="Debt-to-Income Ratio"
//                   type="number"
//                   value={formik.values.dti}
//                   onChange={handleChange}
//                   error={formik.touched.dti && Boolean(formik.errors.dti)}
//                   helperText={formik.touched.dti && formik.errors.dti}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   name="emp_length"
//                   label="Employment Length (years)"
//                   value={formik.values.emp_length}
//                   onChange={handleChange}
//                   error={formik.touched.emp_length && Boolean(formik.errors.emp_length)}
//                   helperText={formik.touched.emp_length && formik.errors.emp_length}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Home Ownership</InputLabel>
//                   <Select name="home_ownership" value={formik.values.home_ownership} onChange={handleChange}>
//                     <MenuItem value="OWN">OWN</MenuItem>
//                     <MenuItem value="RENT">RENT</MenuItem>
//                     <MenuItem value="MORTGAGE">MORTGAGE</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   name="delinq_2yrs"
//                   label="Delinquencies (2 yrs)"
//                   type="number"
//                   value={formik.values.delinq_2yrs}
//                   onChange={handleChange}
//                   error={formik.touched.delinq_2yrs && Boolean(formik.errors.delinq_2yrs)}
//                   helperText={formik.touched.delinq_2yrs && formik.errors.delinq_2yrs}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   name="inq_last_6mths"
//                   label="Inquiries (6 mths)"
//                   type="number"
//                   value={formik.values.inq_last_6mths}
//                   onChange={handleChange}
//                   error={formik.touched.inq_last_6mths && Boolean(formik.errors.inq_last_6mths)}
//                   helperText={formik.touched.inq_last_6mths && formik.errors.inq_last_6mths}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Box mt={2}>
//                   <Typography>Interest Rate: {calculatedRate}%</Typography>
//                   <Typography>Monthly Installment: ${calculatedInstallment}</Typography>
//                 </Box>
//               </Grid>
//               <Grid item xs={12}>
//                 <Button type="submit" variant="contained" color="primary" fullWidth>
//                   Apply
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// };

// export default ApplyLoan;