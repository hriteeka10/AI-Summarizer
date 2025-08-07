import React from "react";

import { logo } from "../assets";

const Hero = () => {
  return (
    <header className='w-full flex justify-center items-center flex-col'>
      <nav className='flex justify-between items-center w-full mb-10 pt-3'>
        <img src={logo} alt='sumz_logo' className='w-28 object-contain' />

        <button
          type='button'
          onClick={() =>
            window.open("https://github.com/hriteeka10", "_blank")
          }
          className='black_btn'
        >
          GitHub
        </button>
      </nav>

      <h1 className='head_text'>
        Instant Article Summaries <br className='max-md:hidden' />
        <span className='orange_gradient '>using AI</span>
      </h1>
      <h2 className='desc'>
        Why read the whole thing when AI can sum it up for you?
      </h2>
    </header>
  );
};

export default Hero;
