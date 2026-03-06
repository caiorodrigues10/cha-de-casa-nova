import React from 'react';

interface ErrorMsgProps {
  message?: string;
}

const ErrorMsg: React.FC<ErrorMsgProps> = ({ message }) =>
  message ? (
    <p className="text-[10px] text-red-400 font-bold mt-1 ml-1 uppercase tracking-wider">
      {message}
    </p>
  ) : null;

export default ErrorMsg;
