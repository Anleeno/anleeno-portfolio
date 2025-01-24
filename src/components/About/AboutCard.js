import React from "react";
import Card from "react-bootstrap/Card";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "left" ,color:"rgb(31,31,31)",fontSize:"large"}}>
            <p style={{fontSize:"larger",textAlign:"center"}}>
              I'm <span className="orange">Anleeno Xu</span>
            </p>
            <p>
              🔭 Research Interests: <b>CV (AIGC, Basic Image Tasks), LM (LLM, VLM), AI4Science...</b>
            </p>
            <p>
              🧸 Experience: <b>Baidu</b> <i>Sr. CV Algo Engineer, 2025/Now</i> <b style={{color: "#A66E38"}}>～</b> <b>Hello</b> <i>CV Algo Engineer, 2023/2024</i>
            </p>
            <p style={{paddingBottom: "10px", textAlign: "center"}}>
              <img src="https://img.shields.io/badge/Python-3498DB?style=for-the-badge&logo=python&logoColor=white" alt="python"/>
              <img src="https://img.shields.io/badge/Java-bed742?style=for-the-badge&logo=java&logoColor=white" alt="java"/>
              <img src="https://img.shields.io/badge/C%2B%2B-FF5722?style=for-the-badge&logo=c%2B%2B&logoColor=white" alt="c++"/>
              <img src="https://img.shields.io/badge/C-00599C?style=for-the-badge&logo=c&logoColor=white" alt="c"/>
              <img src="https://img.shields.io/badge/Pytorch-f47920?style=for-the-badge&logo=pytorch&logoColor=white" alt="pytorch"/>
              <img src="https://img.shields.io/badge/Tensorflow-90d7ec?style=for-the-badge&logo=tensorflow&logoColor=white" alt="tensorflow"/>
              <img src="https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=apple&logoColor=white" alt="ios"/>
              <img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="android"/>
              <img src="https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="spring"/>
              <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D" alt="vue"/>
              <img src="https://img.shields.io/badge/-React-45b8d8?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
              <img src="https://img.shields.io/badge/MySQL-00C7B7?style=for-the-badge&logo=mysql&logoColor=white" alt="mysql"/>
              <img src="https://img.shields.io/badge/Docker-777BB4?style=for-the-badge&logo=docker&logoColor=white" alt="docker"/>
            </p> 
          </p>
          <p style={{ color: "rgb(155 126 172)" }}>
            "Let life be beautiful like summer flowers and death like autumn leaves. 🍁"{" "}
          </p>
          <footer className="blockquote-footer">Rabindranath Tagore</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
