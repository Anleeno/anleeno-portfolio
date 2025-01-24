import React from "react";
import Carousel from 'react-bootstrap/Carousel';

const Slidebar = () => {
    const importAll = (r) => r.keys().map(r);
    const images = importAll(require.context('../../Assets/Gallery/SlideBar', false, /\.(png|jpe?g|gif)$/));

    return (
        <Carousel className="carousel" interval={3000}>
          {images.map((image, index) => (
            <Carousel.Item key={index} className="item">
              <img className="carousel-img" src={image} alt={`Slide ${index + 1}`} />
            </Carousel.Item>
          ))}
        </Carousel>
      );
}

export default Slidebar;
