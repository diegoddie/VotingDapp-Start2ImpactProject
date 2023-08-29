import React from 'react'

const WinnerButton = ({ onDeclareWinner }) => {
    return (
        <button
          className="bg-slate-500 inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide transition duration-200 rounded shadow-md dark:bg-slate-100 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none dark:text-black"
          onClick={onDeclareWinner}
        >
          Declare Winner
        </button>
    );
}

export default WinnerButton