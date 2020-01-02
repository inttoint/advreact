import React from "react";
import { Link } from "react-router-dom";

const UnAuthorized = () => {
  return (
    <div>
      <h2>Unauthorized, please
        <Link to="/auth/signin">Sign In</Link>
      </h2>
    </div>
  );
};

export default UnAuthorized;