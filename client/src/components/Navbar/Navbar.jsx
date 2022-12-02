import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import logo from '../../assets/logo.png';
import useStyles from './styles';
import { connect } from 'react-redux';
import { isUserAuthenticated } from '../../helpers/authUtils';

const PrimarySearchAppBar = ({ totalItems, activeTab }) => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const classes = useStyles();
  const location = useLocation();


  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const mobileMenuId = 'primary-search-account-menu-mobile';

  const renderMobileMenu = (
    <Menu anchorEl={mobileMoreAnchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} id={mobileMenuId} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={isMobileMenuOpen} onClose={handleMobileMenuClose}>
      <MenuItem>
        <IconButton component={Link} to="/cart" aria-label="Show cart items" color="inherit">
          <Badge  overlap="rectangular" badgeContent={totalItems} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
   {activeTab === "home" &&   <AppBar style={{
          width: `calc(100% - ${location.pathname === '/dashboard' ?  76 : 0}px)`,
   }} position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography component={Link} to="/" variant="h6" className={classes.title} color="inherit">
            <img src={logo} alt="bikekings"  className={classes.image} /> BikeKings
          </Typography>
          <div className={classes.grow} />
   
          {isUserAuthenticated() ? (
          <div className={classes.button}>
            <IconButton component={Link} to="/cart" aria-label="Show cart items" color="inherit">
              <Badge  overlap="rectangular" badgeContent={totalItems} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </div>
          ):  <div className={classes.button}>
          <IconButton component={Link} to="/login" aria-label="Show cart items" color="inherit">
             <Typography variant="h6" className={classes.title} color="inherit">Login</Typography>
          </IconButton>
        </div>}
        </Toolbar>
      </AppBar>}
      {renderMobileMenu}
    </>
  );
};


const mapStateToProps = (state) => {
  const {activeTab} = state.Layout;
  return { activeTab };
};

export default connect(mapStateToProps, {})(PrimarySearchAppBar);