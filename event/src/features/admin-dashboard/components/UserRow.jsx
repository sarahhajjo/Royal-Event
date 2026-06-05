import { TableRow, TableCell, Avatar, Typography, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const UserRow = ({ user }) => (
    <TableRow>
        <TableCell><Avatar src={user.avatar} sx={{ width: 50, height: 50 }} /></TableCell>
        <TableCell>
            <Typography fontWeight="bold">{user.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user.role}</Typography>
        </TableCell>
        <TableCell>
            <Typography variant="body2">{user.email}</Typography>
            <Typography variant="caption" color="text.secondary">{user.phone}</Typography>
            <IconButton size="small" sx={{ float: 'right' }}><InfoOutlinedIcon /></IconButton>
        </TableCell>
    </TableRow>
);
export default UserRow;