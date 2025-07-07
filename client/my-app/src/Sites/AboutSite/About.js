
import * as React from "react";
import "./About.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function About(){
  return(

              <div className="about-main">
                  <div className="hello-textbox">
                      <p>About Us
                      </p>
                      <p>
                          <p>At AIWebQuiz, our development is not just about software; it's about cultivating an atmosphere of refined taste and intellectual enrichment. We are a team of highly skilled, motivated, and sophisticated individuals who not only excel in technology but also have a profound appreciation for the finer things in life—be it the complex narratives of classical literature, the subtle nuances of fine art, or the rich, intricate flavors of vintage wines.</p>
                          <p>Join us at AIWebQuiz, where we blend the art of learning with the art of living. Explore our platform and discover how it mirrors the sophistication of learners who not only seek knowledge but also value the cultural richness that shapes our world. Let AIWebQuiz be your portal to a learning experience where knowledge meets the elegance of fine arts and the discerning taste of a well-aged wine.</p>
                          And remember, steer clear of The Foul Tempting Ghouls of procrastination and misinformation.
                          Explore our website to learn more about how our tools can enhance your academic
                          performance.
                      </p>
                          <p>
                              If you have any questions, please contact us on our "contact" page, where out
                              intern jesper will be receiving and answering any of your questions. Happy studying!</p>
                  </div>
                  <ReturnBilderBoxes/>
              </div>

  )
}

function ReturnBilderBoxes() {
    return (
        <div className="about-rightside">
                <div className="picture-box-container">
                    <div className="picture-box">
                        <img src="../Henrik.jpg" alt="Hänki" className="quiz-image-hanki"/>
                        <p className="quiz-text">Hänki</p>
                    </div>
                </div>
                <div className="picture-box-container">
                    <div className="picture-box">
                        <img src="../Johan.jpg" alt="john" className="quiz-image-john"/>
                        <p className="quiz-text">John</p>
                    </div>
                </div>

                <div className="picture-box-container">
                    <div className="picture-box">
                        <img src="../Jesper.jpg" alt="jeppe" className="quiz-image"/>
                        <p className="quiz-text">Jeppe</p>
                    </div>
                </div>
                <div className="picture-box-container">
                    <div className="picture-box">
                        <img src="../Nils.jpg" alt="nils" className="quiz-image-nilsfri"/>
                        <p className="quiz-text">Nilsfri</p>
                    </div>
                </div>
                <div className="picture-box-container">
                    <div className="picture-box">
                        <img src="../Mattias.jpg" alt="mattias" className="quiz-image"/>
                        <p className="quiz-text">Matfri</p>
                    </div>
                </div>
        </div>
    )
}


 export default About;