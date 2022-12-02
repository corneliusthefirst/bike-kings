import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton } from '@material-ui/core';
import { AddShoppingCart } from '@material-ui/icons';

import useStyles from './styles';
import { isUserAuthenticated } from '../../../helpers/authUtils';
import ShowMoreText from "react-show-more-text";

const Product = ({ product, onAddToCart }) => {
  const classes = useStyles();
  const isLoggedIn = isUserAuthenticated()
  const handleAddToCart = () => onAddToCart(product.id, 1);

  return (
    <Card className={`${classes.root} h-full`}>
      <CardMedia className={classes.media} image={product.media.source} title={product.name} />
      <CardContent>
        <div className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
          <Typography className='pl-8' gutterBottom variant="h5" component="h2">
            ${product.price.formatted}
          </Typography>
        </div>
        <ShowMoreText
                /* Default options */
                lines={2}
                more="Show more"
                less="Show less"
                className="content-css min-h-36"
                anchorClass="show-more-less-clickable"
                expanded={false}
                width={320}
                truncatedEndingComponent={"... "}
            >
                <Typography dangerouslySetInnerHTML={{ __html: product.description }} variant="body2" color="textSecondary" component="p" />
            </ShowMoreText>
      </CardContent>
    {isLoggedIn &&
    <CardActions  disableSpacing className={classes.cardActions}>
        <IconButton aria-label="Add to Cart" onClick={handleAddToCart}>
          <AddShoppingCart />
        </IconButton>
      </CardActions>
  }
    </Card>
  );
};

export default Product;

