import xanoAPI from '../config/xano';

class AuthService {
  constructor() {
    this.tokenKey = 'electroverse-token';
    this.refreshTokenKey = 'electroverse-refresh-token';
    this.userKey = 'electroverse-user';
  }

  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Obtener refresh token del localStorage
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Guardar tokens en localStorage
  setTokens(accessToken, refreshToken) {
    localStorage.setItem(this.tokenKey, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  // Limpiar tokens del localStorage
  clearTokens() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Obtener usuario del localStorage
  getUser() {
    try {
      const userStr = localStorage.getItem(this.userKey);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  }

  // Guardar usuario en localStorage
  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    try {
      const token = this.getToken();
      const user = this.getUser();
      return !!(token && user);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role) {
    const user = this.getUser();
    return user && user.role === role;
  }

  // Verificar si el usuario es admin
  isAdmin() {
    return this.hasRole('admin');
  }

  // Verificar si el usuario es vendedor
  isVendedor() {
    return this.hasRole('vendedor');
  }

  // Determinar el rol del usuario basado en el email
  determineUserRole(email) {
    const adminEmails = [
      'admin@electroverse.com',
      'admin@electroverse.cl',
      'administrador@electroverse.com',
      'administrador@electroverse.cl'
    ];
    
    const sellerEmails = [
      'vendedor@electroverse.com',
      'vendedor@electroverse.cl',
      'seller@electroverse.com',
      'seller@electroverse.cl'
    ];
    
    if (adminEmails.includes(email.toLowerCase())) {
      return 'admin';
    } else if (sellerEmails.includes(email.toLowerCase())) {
      return 'vendedor';
    } else {
      return 'user';
    }
  }

  // Obtener perfil del usuario desde Xano
  async getProfileFromXano(token) {
    try {
      console.log('🔍 getProfileFromXano - Calling Xano API with token:', token.substring(0, 20) + '...');
      const response = await xanoAPI.getProfile(token);
      console.log('🔍 getProfileFromXano - Xano profile response:', response);
      
      if (response.id) {
        // Mapear la respuesta de Xano a nuestro formato
        const user = {
          id: response.id,
          name: response.name || response.email.split('@')[0],
          email: response.email,
          role: this.determineUserRole(response.email),
          isActive: true,
          createdAt: response.created_at
        };
        
        console.log('🔍 getProfileFromXano - Mapped user from Xano:', user);
        
        return {
          success: true,
          user
        };
      } else {
        throw new Error('Invalid user data from Xano');
      }
    } catch (error) {
      console.error('🔍 getProfileFromXano - Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Login con Xano
  async login(email, password) {
    try {
      console.log('🔍 AuthService - Starting login for:', email);
      const response = await xanoAPI.login(email, password);
      console.log('🔍 AuthService - Xano response:', response);
      
      // Xano devuelve directamente el token
      if (response.authToken) {
        const { authToken } = response;
        console.log('🔍 AuthService - Got authToken:', authToken);
        
        // Guardar token
        this.setTokens(authToken);
        
        // Obtener datos completos del usuario desde Xano
        console.log('🔍 AuthService - Getting profile from Xano...');
        const userProfile = await this.getProfileFromXano(authToken);
        console.log('🔍 AuthService - Profile result:', userProfile);
        
        if (userProfile.success) {
          // Guardar usuario completo de Xano
          this.setUser(userProfile.user);
          
          return {
            success: true,
            user: userProfile.user,
            message: 'Login exitoso'
          };
        } else {
          // Si no se puede obtener el perfil, crear usuario básico
          const user = {
            id: Date.now(),
            name: email.split('@')[0],
            email: email,
            role: this.determineUserRole(email),
            isActive: true
          };
          
          this.setUser(user);
          
          return {
            success: true,
            user,
            message: 'Login exitoso'
          };
        }
      } else {
        return {
          success: false,
          error: response.message || 'Error al iniciar sesión'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Error de conexión. Intenta nuevamente.'
      };
    }
  }

  // Registro con Xano
  async register(userData) {
    try {
      console.log('🔍 AuthService - Starting register with data:', userData);
      const response = await xanoAPI.register(userData);
      console.log('🔍 AuthService - Xano register response:', response);
      
      // Xano devuelve directamente el token
      if (response.authToken) {
        const { authToken } = response;
        
        // Guardar token
        this.setTokens(authToken);
        
        // Obtener datos completos del usuario desde Xano
        const userProfile = await this.getProfileFromXano(authToken);
        
        if (userProfile.success) {
          // Guardar usuario completo de Xano
          this.setUser(userProfile.user);
          
          return {
            success: true,
            user: userProfile.user,
            message: 'Registro exitoso'
          };
        } else {
          console.log('⚠️ No se pudo obtener perfil de Xano, creando usuario básico');
          // Si no se puede obtener el perfil, crear usuario básico
          const user = {
            id: Date.now(),
            name: userData.first_name || userData.email.split('@')[0],
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            email: userData.email,
            role: this.determineUserRole(userData.email),
            isActive: true
          };
          
          this.setUser(user);
          
          return {
            success: true,
            user,
            message: 'Registro exitoso'
          };
        }
      } else {
        return {
          success: false,
          error: response.message || 'Error al registrarse'
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      
      // Manejar errores específicos de Xano
      if (error.message && error.message.includes('ERROR_CODE_INPUT_ERROR')) {
        const errorMatch = error.message.match(/"message":"([^"]+)"/);
        if (errorMatch) {
          return {
            success: false,
            error: errorMatch[1]
          };
        }
      }
      
      return {
        success: false,
        error: 'Error de conexión. Intenta nuevamente.'
      };
    }
  }

  // Logout
  async logout() {
    try {
      // Limpiar datos locales directamente (no hay endpoint de logout en Xano)
      this.clearTokens();
      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    } catch (error) {
      console.error('Logout error:', error);
      // Limpiar datos locales incluso si hay error
      this.clearTokens();
      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    }
  }

  // Obtener perfil del usuario
  async getProfile() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const userProfile = await this.getProfileFromXano(token);
      
      if (userProfile.success) {
        this.setUser(userProfile.user);
        return {
          success: true,
          user: userProfile.user
        };
      } else {
        throw new Error(userProfile.error || 'Error al obtener perfil');
      }
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'Error al obtener perfil del usuario'
      };
    }
  }

  // Actualizar perfil
  async updateProfile(userData) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await xanoAPI.updateProfile(token, userData);
      
      if (response.success) {
        const user = response.data;
        this.setUser(user);
        return {
          success: true,
          user,
          message: 'Perfil actualizado exitosamente'
        };
      } else {
        return {
          success: false,
          error: response.message || 'Error al actualizar perfil'
        };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'Error al actualizar perfil'
      };
    }
  }

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await xanoAPI.changePassword(token, currentPassword, newPassword);
      
      if (response.success) {
        return {
          success: true,
          message: 'Contraseña cambiada exitosamente'
        };
      } else {
        return {
          success: false,
          error: response.message || 'Error al cambiar contraseña'
        };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: 'Error al cambiar contraseña'
      };
    }
  }

  // Recuperar contraseña
  async forgotPassword(email) {
    try {
      const response = await xanoAPI.forgotPassword(email);
      
      if (response.success) {
        return {
          success: true,
          message: 'Se ha enviado un enlace de recuperación a tu email'
        };
      } else {
        return {
          success: false,
          error: response.message || 'Error al enviar email de recuperación'
        };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: 'Error al enviar email de recuperación'
      };
    }
  }

  // Verificar email
  async verifyEmail(token) {
    try {
      const response = await xanoAPI.verifyEmail(token);
      
      if (response.success) {
        return {
          success: true,
          message: 'Email verificado exitosamente'
        };
      } else {
        return {
          success: false,
          error: response.message || 'Error al verificar email'
        };
      }
    } catch (error) {
      console.error('Verify email error:', error);
      return {
        success: false,
        error: 'Error al verificar email'
      };
    }
  }

  // Refrescar token
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No hay refresh token');
      }

      const response = await xanoAPI.refreshToken(refreshToken);
      
      if (response.success) {
        const { access_token, refresh_token } = response.data;
        this.setTokens(access_token, refresh_token);
        return {
          success: true,
          token: access_token
        };
      } else {
        // Si el refresh token es inválido, limpiar todo
        this.clearTokens();
        throw new Error('Refresh token inválido');
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      this.clearTokens();
      return {
        success: false,
        error: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
      };
    }
  }

  // Verificar si el token está expirado
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Auto-refresh token si es necesario
  async ensureValidToken() {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }

    if (this.isTokenExpired(token)) {
      const refreshResult = await this.refreshToken();
      return refreshResult.success;
    }

    return true;
  }
}

// Crear instancia singleton
const authService = new AuthService();

export default authService;
