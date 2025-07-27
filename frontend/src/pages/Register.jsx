import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Card, CardContent, Typography, Container, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short').required('Required'),
  role: Yup.string().oneOf(['user', 'admin']).required('Required'),
});

const Register = () => {
  const { register } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', role: 'user' },
    validationSchema: RegisterSchema,
    onSubmit: (values) => register(values.name, values.email, values.password, values.role),  // Pass role
  });

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Register</Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
            />
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;