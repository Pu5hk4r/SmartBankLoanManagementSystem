import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import NavBar from '../components/NavBar';

const Home = () => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h2" gutterBottom>
        Smart Bank Loan System
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Apply for loans, track your applications, and manage your finances with ease. Powered by AI-driven risk prediction.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" component={Link} to="/login" style={{ marginRight: '10px' }}>
          Login
        </Button>
        <Button variant="outlined" color="primary" component={Link} to="/register">
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Home;