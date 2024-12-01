// src/layout/Dashboard/Drawer/DrawerContent/Navigation/NavGroup.jsx

import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavItem from './NavItem';
import { useGetMenuMaster } from 'api/menu';

export default function NavGroup({ item }) {
    const { menuMaster } = useGetMenuMaster();
    const { user } = useContext(AuthContext);
    const drawerOpen = menuMaster.isDashboardDrawerOpened;

    if (!user) {
        // If user is not yet loaded, return null or a loading state
        return null;
    }

    const navCollapse = item.children?.map((menuItem) => {
        if (menuItem.userTypes && !menuItem.userTypes.includes(user.user_type)) {
            return null;
        }
        switch (menuItem.type) {
            case 'item':
                return <NavItem key={menuItem.id} item={menuItem} level={1} />;
            default:
                return (
                    <Typography key={menuItem.id} variant="h6" color="error" align="center">
                        Fix - Group Collapse or Items
                    </Typography>
                );
        }
    });

    return (
        <List
            subheader={
                item.title &&
                drawerOpen && (
                    <Box sx={{ pl: 3, mb: 1.5 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            {item.title}
                        </Typography>
                    </Box>
                )
            }
            sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
        >
            {navCollapse}
        </List>
    );
}

NavGroup.propTypes = { item: PropTypes.object };
