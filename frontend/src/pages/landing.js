import React from "react";
import { useNavigate } from 'react-router-dom'
import { categories } from '../utils'
import { logo, iconHealth, iconCommunity, iconRetirement } from '../assets/images'

const Landing = () => {
  const navigate = useNavigate();
  const handleClick = (type) => {
    navigate(`/transaction/${type}`)  
  }

  return (
    <div className="h-100 d-flex flex-column flex-nowrap justify-content-center gap-1">
      <div className="row justify-content-center mx-3 mx-md-5 mx-lg-auto" data-aos="fade-up">
        <img src={logo} style={{ height: '220px', width: '240px' }}/>
      </div>
      {Object.keys(categories).map((x, i) => (
        <div
          key={x}
          className="text-uppercase fw-semibold fs-5 btn btn-outline-light btn-darbuka mx-3 mx-md-5 mx-lg-auto py-3 shadow-sm"
          style={{ minWidth: '25vw' }}
          onClick={() => handleClick(x)}
          data-aos="fade-up"
          data-aos-delay={(i+1) * 400}
        >
          {x === 'community' && <img src={iconCommunity} width={50} height={50} />}
          {x === 'health' && <img src={iconHealth} width={50} height={50} />}
          {x === 'retirement' && <img src={iconRetirement} width={50} height={50} />}
          &nbsp;{categories[x]}
        </div>
      ))}
    </div>
  )
}

export default Landing;