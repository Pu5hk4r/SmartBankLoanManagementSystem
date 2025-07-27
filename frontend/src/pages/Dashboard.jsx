import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Button, Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';



const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/v1/loans/my-loans').then(res => setLoans(res.data));
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>User Dashboard</Typography>
      <Box display="flex" gap={2} mb={4}>
        <Button variant="contained" color="primary" onClick={() => navigate('/apply-loan')}>
          Apply for Loan
        </Button>
        <Button variant="outlined" color="secondary" onClick={logout}>
          Logout
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom>My Loans</Typography>
      {loans.length > 0 ? (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Risk Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map(loan => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.id}</TableCell>
                  <TableCell>${loan.amount.toFixed(2)}</TableCell>
                  <TableCell>{loan.status}</TableCell>
                  <TableCell>{(loan.default_risk_score * 100).toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <Typography>No loans applied yet.</Typography>
      )}
    </Container>
  );
};

export default Dashboard;