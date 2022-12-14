import React from 'react';
import Grid from '@material-ui/core/Grid';

import Product from './Product/Product';
import useStyles from './styles';
import ChatBotRobot from '../../screens/Chatbot/Chatbot.component';
import { useState } from 'react';
import { SvgIcon } from '@material-ui/core';
import { ReactComponent as ChatBotIconSvg } from "../../assets/images/chatbot.svg";
import { useEffect } from 'react';
import { getLoggedInUser } from '../../helpers/authUtils';
import { getOrCreateRoom } from '../../api/room';
import useMessageSocket from '../../api/socket/useMessageSocket';
import { ROOM_MESSAGES_KEY } from '../../constants/queryKeys';

const ChatBotIcon = (props) => {
  const [room, setRoom] = useState({})
  useEffect(() => {
    init()
 }, [])



 const init = async () => {
     const { id }= getLoggedInUser()
     const roomCreated = await getOrCreateRoom(id)
     setRoom(roomCreated)
     console.log('roomCreated', roomCreated)
 }

 useMessageSocket(room?.id, ROOM_MESSAGES_KEY(room?.id))

  return (
      <div className="chatbot-icon">
        <SvgIcon onClick={() => props?.setChatbot(!props.chatbot)} >
          <ChatBotIconSvg />
        </SvgIcon>
        {props?.chatbot && <ChatBotRobot room={room} setChatbot={props?.setChatbot}/>}
      </div>
  )
}


const Products = ({ products, onAddToCart }) => {
  const classes = useStyles();
  const [chatbot, setChatbot] = useState(false);
  if (!products.length) return <p>Loading...</p>;

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Grid container justifyContent="center" spacing={4} >
        {products.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
            <Product product={product} onAddToCart={onAddToCart} />
          </Grid>
        ))}
      </Grid>
      <ChatBotIcon setChatbot={setChatbot} chatbot={chatbot} />
    </main>
  );
};

export default Products;

