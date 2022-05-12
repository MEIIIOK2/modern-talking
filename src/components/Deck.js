import React, { useState,useEffect } from "react";
import { useSprings } from "react-spring/hooks";
import { useGesture } from "react-with-gesture";
import Card from "./Card";
import axios from 'axios';
import "../styles/Deck.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const cards = 27

const to = i => ({
  x: 20,
  y: i * -5,
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
  
  
  
  const [props, set] = useSprings(cards, i => ({
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
            var percent = 'C вами согласны '+Math.round(resp.data.percent*100,2)+' % пользователей' 
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
  
        if (!down && gone.size === cards)
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
