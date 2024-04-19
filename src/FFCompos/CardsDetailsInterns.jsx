// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
// import Collapse from '@mui/material/Collapse';
// import Avatar from '@mui/material/Avatar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import { red } from '@mui/material/colors';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// export default function CardsDetailsInterns({ cardsData }) {
//   const [expanded, setExpanded] = React.useState({});
  
//   const handleExpandClick = (index) => {
//     setExpanded(prevState => ({
//       ...prevState,
//       [index]: !prevState[index],
//     }));
//   };

//   return (
//     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
//       {cardsData.map((card, index) => (
//         <Card key={index} sx={{ maxWidth: 345, width: '100%', marginBottom: '20px' }}>
//           <CardHeader
//             avatar={
//               <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
//                 R
//               </Avatar>
//             }
//             action={
//               <IconButton aria-label="settings">
//                 <ShareIcon />
//               </IconButton>
//             }
//             title={card.title}
//             subheader={card.subheader}
//           />
//           <CardMedia
//             component="img"
//             height="194"
//             image={card.image}
//             alt={card.alt}
//           />
//           <CardContent>
//             <Typography variant="body2" color="text.secondary">
//               {card.description}
//             </Typography>
//           </CardContent>
//           <CardActions disableSpacing>
//             <IconButton aria-label="add to favorites">
//               <FavoriteIcon />
//             </IconButton>
//             <ExpandMore
//               expand={expanded[index] || false}
//               onClick={() => handleExpandClick(index)}
//               aria-expanded={expanded[index] || false}
//               aria-label="show more"
//             >
//               <ExpandMoreIcon />
//             </ExpandMore>
//           </CardActions>
//           <Collapse in={expanded[index] || false} timeout="auto" unmountOnExit>
//             <CardContent>
//               <Typography paragraph>Method:</Typography>
//               {card.method.map((step, idx) => (
//                 <Typography key={idx} paragraph>{step}</Typography>
//               ))}
//             </CardContent>
//           </Collapse>
//         </Card>
//       ))}
//     </div>
//   );
// }

