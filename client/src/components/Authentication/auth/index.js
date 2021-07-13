import axios from "axios";

export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    return;
  }
  next();
};

export const signout = async () => {

  const { token } = isAuthenticated();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  if (typeof window !== "undefined") {
    try {
      const res = await axios.get(`/logout`, config);
      localStorage.removeItem("jwt");
      if (res)
        window.alert(res.data.user.fname + " logged out successfully");
      window.location = "/";

    } catch (error) {
      console.log(error);
      window.alert("Session expired SignIn again");
      localStorage.removeItem("jwt");
      window.location.reload();
      return;
    }
  }
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }

  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};