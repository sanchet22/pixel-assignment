

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';
import Avatar from '@mui/material/Avatar';
import { Box } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');

  const fetchUsers = async (page, rowsPerPage) => {
    const limit = rowsPerPage;
    const skip = page * limit;
    const { data } = await axios.get('https://dummyjson.com/users', {
      params: { limit, skip },
    });
    setUsers(data.users);
  };

  useEffect(() => {
    fetchUsers(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedUsers = [...users].sort((a, b) => {
      let aValue, bValue;

      if (property === 'fullName') {
        aValue = a.firstName + ' ' + a.lastName;
        bValue = b.firstName + ' ' + b.lastName;
      } else {
        aValue = a[property];
        bValue = b[property];
      }

      if (isAsc) return aValue < bValue ? -1 : 1;
      return aValue > bValue ? -1 : 1;
    });

    setUsers(sortedUsers);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'gender') setGender(value);
    if (filterType === 'country') setCountry(value);
    setPage(0);
    fetchUsers(0, rowsPerPage);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter(user => {
    return (!gender || user.gender === gender) &&
           (!country || user.address.country === country);
  });

  const customSortIcon = (props) => {
    const { direction } = props;
    return direction === 'desc' ? (
      <ArrowDownwardIcon sx={{ color: 'red' }} />
    ) : (
      <ArrowUpwardIcon />
    );
  };

  return (
    <Box
      my={10}
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
      sx={{ border: '2px solid grey', height: '150%', width: '75%' }}
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
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={order}
                    onClick={() => handleSort('id')}
                    IconComponent={customSortIcon}
                  >
                    <b>ID</b>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'firstName'}
                    direction={order}
                    onClick={() => handleSort('firstName')}
                    IconComponent={customSortIcon}
                  >
                    <b>Full Name</b>
                  </TableSortLabel>
                </TableCell>
                <TableCell><b>Image</b></TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'gender'}
                    direction={order}
                    onClick={() => handleSort('gender')}
                  >
                    <b>Demography</b>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'company.title'}
                    direction={order}
                    onClick={() => handleSort('company.title')}
                  >
                    <b>Designation</b>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'address.state'}
                    direction={order}
                    onClick={() => handleSort('address.state')}
                  >
                    <b>Location</b>
                  </TableSortLabel>
                </TableCell>
                {/* Add more sortable columns as needed */}
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
                  {/* Add more user details as needed */}
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