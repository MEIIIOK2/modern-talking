import React from "react";
import { animated, interpolate } from "react-spring/hooks";
import Carousel from "nuka-carousel";

class Card extends React.Component {
  render() {
    const { i, x, y, rot, scale, trans, cards, bind, objs } = this.props;
    
    const { name, id, year, author, description, hashtags} = objs[i];

    return (
      <animated.div
        key={i}
        style={{
          transform: interpolate(
            [x, y],
            (x, y) => `translate3d(${x}px,${y}px,0)`
          )
        }}
      >
        <animated.div
          {...bind(i)}
          style={{
            transform: interpolate([rot, scale], trans)
          }}
        >
          <div className="card">
            <Carousel>
              
              <img src={'https://cardanoyield.info/img?num='+id}  style={{width:350,height:350,marginLeft:"auto",marginRight:"auto"}} alt="Nopicturefound" />
              
            </Carousel>
            <h2>{name},</h2>
            <h2>{author},</h2>
            <h2>{year}</h2>
            {/* <h2>{id}</h2> */}
            
            <h5>{description}</h5>
            <h6>{hashtags}</h6>
          </div>
        </animated.div>
      </animated.div>
    );
  }
}

export default Card;
