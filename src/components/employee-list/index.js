import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../../actions/userActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Select, MenuItem, Avatar, TablePagination } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const UserList = () => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.users);

  // State variables for filters
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'gender') setGender(value);
    if (filterType === 'country') setCountry(value);
    setPage(0);
    // Fetch users if you need to reload data based on filters, otherwise this is enough
  };

  // Filter users based on the selected gender
  const filteredUsers = usersData.users.filter((user) =>
    gender ? user.gender === gender : true
  );

  return (
    <Box
      my={10}
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
    >
      <Paper elevation={3} sx={{ borderRadius: 4, padding: 4, width: '80%' }}>
        <Box display="flex" flexDirection="column" mb={2}>
          <div>
            <h1>Employees</h1>
          </div>
          <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
            <Box display="flex" alignItems="center">
              <FilterAltIcon sx={{ color: 'red', mr: 1 }} />
              <Select
                value={country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                displayEmpty
                sx={{
                  minWidth: 120,
                  height: 40,
                  borderRadius: 1,
                }}
              >
                <MenuItem value="">All Countries</MenuItem>
                {/* Add more countries as needed */}
              </Select>
            </Box>
            <Select
              value={gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              displayEmpty
              sx={{
                minWidth: 120,
                height: 40,
                borderRadius: 1,
              }}
            >
              <MenuItem value="">Genders</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </Box>
        </Box>
          
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Demography</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>
                    <Avatar alt={`${user.firstName} ${user.lastName}`} src={user.image} />
                  </TableCell>
                  <TableCell>{user.gender.charAt(0).toUpperCase()}/{user.age}</TableCell>
                  <TableCell>{user.company.title}</TableCell>
                  <TableCell>{user.address.state}, USA</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={100} // Assuming a total of 100 users, update as needed
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default UserList;
