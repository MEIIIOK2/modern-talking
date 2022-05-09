import React, { useState,useEffect } from "react";
import { useSprings } from "react-spring/hooks";
import { useGesture } from "react-with-gesture";
import Card from "./Card";
import axios from 'axios';
import "../styles/Deck.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const cards = [1, 2];

// const objs = [
//   {
//     pics: [
//       "http://127.0.0.1:5000/img"
//     ],
//     name: "Chloe",
//     age: 18,
//     distance: "1 mile away",
//     text: "The C and the L are silent."
//   },
//   {
//     pics: [
//       "https://images.unsplash.com/photo-1535378719329-f0a8b9a42152?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
//     ],
//     name: "Sarah",
//     age: 24,
//     distance: "5 miles away",
//     text:
//       "It's tough being a single mom. Or so I'm told, I wouldn't know; I don't have kids."
//   },
//   {
//     pics: [
//       "https://images.unsplash.com/photo-1514924801778-1db0aba75e9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
//     ],
//     name: "Savannah",
//     age: 29,
//     distance: "3 miles away",
//     text: "A little known fact is that I cover about 40% of Africa."
//   },
//   {
//     pics: [
//       "https://images.unsplash.com/photo-1456885284447-7dd4bb8720bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80",
//       "https://images.unsplash.com/photo-1532635270-c09dac425ca9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
//     ],
//     name: "Jane",
//     age: 22,
//     distance: "2 miles away",
//     text:
//       "On the first date I will carve our initials in a tree. It's the most romantic way to let you know I have a knife."
//   }
// ];




const to = i => ({
  x: 0,
  y: i * -10,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100
});
const from = i => ({ rot: 0, scale: 1.5, y: -1000 });

const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r /
    10}deg) rotateZ(${r}deg) scale(${s})`;

function Deck() {
  const [gone] = useState(() => new Set());
  const [objs,setobjs] = useState([]);
  useEffect(()=>{
    axios.get('https://cardanoyield.info/info').then((resp)=>{
      setobjs(resp.data);console.log(resp.data)
    })
  },[])
  
  
  
  const [props, set] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i)
  }));

  

  if(objs.length>1){
    const bind = useGesture(
      ({
        args: [index],
        down,
        delta: [xDelta],
        distance,
        direction: [xDir],
        velocity
      }) => {
        const trigger = velocity > 0.2;
  
        const dir = xDir < 0 ? -1 : 1;
  
        if (!down && trigger) {
          gone.add(index);
          
          axios.get('https://cardanoyield.info/ans?id='+objs[index].id+'&ans='+dir).then((resp)=>{
            var percent = 'с вами согласны '+Math.round(resp.data.percent*100,2)+' % пользователей' 
            Notify.success(percent);
          })
        }
  
        set(i => {
          if (index !== i) return;
          const isGone = gone.has(index);
  
          const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0;
  
          const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0);
  
          const scale = down ? 1.1 : 1;
          return {
            
            x,
            rot,
            scale,
            delay: undefined,
            config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
          };
        });
  
        if (!down && gone.size === cards.length)
          setTimeout(() => gone.clear() || set(i => to(i)), 600);
      }
    );
    return( 
      props.map(({ x, y, rot, scale }, i) => (
       <Card i={i} x={x} y={y} rot={rot} scale={scale} trans={trans} cards={cards} objs={objs} bind={bind} />
      
     ))
    
    )
      
    
  }
  else{
    return(
      <h1>Loading</h1>
    )
  }
}

export default Deck;
