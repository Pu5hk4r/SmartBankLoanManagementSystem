// Your latest version with charts; changed loan.user_email to loan.user_email || loan.user_id (fallback)
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Button, Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box } from '@mui/material';
import { PieChart, Pie, Tooltip, Legend, Cell, BarChart, Bar, XAxis, YAxis } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];

const AdminPanel = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    api.get('/api/v1/loans/all-loans').then(res => setLoans(res.data));
  }, []);

  const approve = (id) => {
    api.put(`/api/v1/loans/approve/${id}`).then(() => {
      setLoans(loans.map(l => l.id === id ? { ...l, status: 'approved' } : l));
    });
  };

  const reject = (id) => {
    api.put(`/api/v1/loans/reject/${id}`).then(() => {
      setLoans(loans.map(l => l.id === id ? { ...l, status: 'rejected' } : l));
    });
  };

  // Stats for charts
  const statusCounts = loans.reduce((acc, loan) => {
    acc[loan.status] = (acc[loan.status] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));
  const barData = loans.map(loan => ({ id: loan.id, amount: loan.amount }));

  return (
    <Container maxWidth="lg" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Box display="flex" gap={4}>
        <Box flex={1}>
          <Typography variant="h6">Loan Status Distribution</Typography>
          <PieChart width={400} height={400}>
            <Pie dataKey="value" data={pieData} fill="#8884d8" label>
              {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Box>
        <Box flex={1}>
          <Typography variant="h6">Loan Amounts</Typography>
          <BarChart width={500} height={300} data={barData}>
            <XAxis dataKey="id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </Box>
      </Box>
      <Typography variant="h5" gutterBottom mt={4}>All Loans</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell> {/* Changed header to User */}
              <TableCell>Amount</TableCell>
              <TableCell>Risk Score</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map(loan => (
              <TableRow key={loan.id}>
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.user_email || loan.user_id}</TableCell> {/* Fallback to user_id if no email */}
                <TableCell>${loan.amount.toFixed(2)}</TableCell>
                <TableCell>{(loan.default_risk_score * 100).toFixed(2)}%</TableCell>
                <TableCell>{loan.status}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success" onClick={() => approve(loan.id)} style={{ marginRight: '10px' }}>
                    Approve
                  </Button>
                  <Button variant="contained" color="error" onClick={() => reject(loan.id)}>
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AdminPanel;