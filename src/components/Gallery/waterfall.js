import React, { useState, useEffect } from 'react';
import LazyLoad from 'react-lazyload';
import { Col, Container, Row } from 'react-bootstrap';

const Waterfall = () => {
  const importAll = (r) => r.keys().map(r);
  const images = importAll(require.context('../../Assets/Gallery', false, /\.(png|jpe?g|gif)$/));

  const [columns, setColumns] = useState(3);

  const getColumns = () => {
    const width = window.innerWidth;
    if (width < 576) {
      return 1;
    } else if (width < 768) {
      return 2;
    } else {
      return 3; 
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setColumns(getColumns());
    };

    setColumns(getColumns());
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getImageColumns = () => {
    const columnImages = Array.from({ length: columns }, () => []);  // 创建 columns 个空数组
    images.forEach((image, index) => {
      columnImages[index % columns].push(image);  // 按列分配图片
    });
    return columnImages;
  };

  const imageColumns = getImageColumns();

  return (
    <Container>
      <Row className="gallery-wrap">
        {imageColumns.map((column, colIndex) => (
          <Col key={colIndex} md={12 / columns} className="gallery-column">
            {column.map((image, imgIndex) => (
              <div key={imgIndex} className="gallery-item">
                <LazyLoad >
                  <img src={image} alt={`Gallery item ${imgIndex}`} />
                </LazyLoad>
              </div>
            ))}
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Waterfall;