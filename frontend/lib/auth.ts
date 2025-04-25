interface JwtPayload {
    sub: string;
    role?: string;
    exp: number;
    id: number; // ✅ added
  }
  
  function parseJwt(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
  
  export const getUserFromToken = () => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    
    if (!token || !email || !role || !userId) return null;
    
    return {
      token,
      email,
      role,
      id: Number(userId),
    };
  };
  
  