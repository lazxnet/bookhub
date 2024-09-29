import React from 'react';
import "./About.css";
import aboutImg from "../../images/about-img.jpg";

const About = () => {
  return (
    <section className='about'>
      <div className='container'>
        <div className='section-title'>
          <h2>About</h2>
        </div>

        <div className='about-content grid'>
          <div className='about-img'>
            <img src = {aboutImg} alt = "" />
          </div>
          <div className='about-text'>
            <h2 className='about-title fs-26 ls-1'>Acerca de BookHub</h2>
            <p className='fs-17'>BookHub es una plataforma en línea dedicada al mundo del libro y la lectura. Esta página ofrece una experiencia de usuario inmersiva y fácil de navegar, diseñada para satisfacer las necesidades de los amantes del libro en busca de contenido literario de alta calidad.</p>
            <p className='fs-17'>BookHub busca fomentar el amor por la lectura y conectar a los usuarios con obras que enriquezcan su vida cultural y personal. Con su interfaz intuitiva y contenido variado, esta página se convierte en un punto de encuentro ideal para todos aquellos que buscan expandir sus horizontes literarios.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
