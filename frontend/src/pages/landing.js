import React from "react";
import { useNavigate } from 'react-router-dom'
import { categories } from '../utils'
const Landing = () => {
  const navigate = useNavigate();
  const handleClick = (type) => {
    navigate(`/transaction/${type}`)  
  }

  return (
    <div className="h-100 d-flex flex-column flex-nowrap justify-content-center gap-2 bg-body-darbuka-primary">
      {Object.keys(categories).map((x, i) => (
        <div
          key={x}
          data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
          className="text-uppercase fw-semibold fs-5 btn btn-outline-light btn-darbuka mx-3 mx-md-5 mx-lg-auto py-5"
          style={{ minWidth: '50vw' }}
          onClick={() => handleClick(x)}
        >
          {categories[x]}
        </div>
      ))}
    </div>
  )
}

export default Landing;