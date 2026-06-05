import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell } from '@mui/material';
import UserRow from './UserRow';
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

const DirectoryTable = ({ users }) => {
    // التأكد من أن users مصفوفة قبل عمل map
    const userList = Array.isArray(users) ? users : [];

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow
                        key={user.id}
                        sx={{
                            '& td': {
                                borderBottom: '1px solid #E5E0D8', // خط فاصل أوضح قليلاً
                                py: 3
                            }
                        }}
                    >
                        {/* Avatar */}
                        <TableCell>< Avatar sx={{ width: 50, height: 50, bgcolor: '#D1C5B4' }} /></TableCell>

                        {/* Identity */}
                        <TableCell>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#2D2926' }}>
                                {user.name}
                            </Typography>
                            <Typography sx={{ fontSize: '11px', letterSpacing: '1px', color: '#7A6F5E', fontWeight: 600 }}>
                                {user.role}
                            </Typography>
                        </TableCell>

                        {/* Correspondence */}
                        <TableCell>
                            <Typography sx={{ color: '#2D2926', fontWeight: 500 }}>{user.email}</Typography>
                            <Typography variant="body2" sx={{ color: '#5A5043' }}>{user.phone}</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userList.map(user => (
                        <UserRow key={user.id} user={user} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default DirectoryTable;