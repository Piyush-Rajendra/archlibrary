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
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return null;
    const decoded = parseJwt(token);
    if (!decoded) return null;
  
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
  
    return {
      email: decoded.sub,
      role: decoded.role || 'UNKNOWN',
      id: decoded.id,       
      token,
    };
  };
  