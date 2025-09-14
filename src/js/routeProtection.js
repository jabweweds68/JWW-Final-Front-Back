// // Enhanced routeProtection.js - Frontend route protection with better page detection
// class RouteProtection {
//   constructor() {
//     this.TOKEN_KEY = 'adminToken';
//     this.USER_INFO_KEY = 'adminInfo';
//     this.isInitialized = false;
//   }

//   // Check if token exists and is valid
//   hasToken() {
//     const token = localStorage.getItem(this.TOKEN_KEY);
//     return !!(token && token.trim() !== '');
//   }

//   // Get stored token
//   getToken() {
//     return localStorage.getItem(this.TOKEN_KEY);
//   }

//   // Get stored user info
//   getUserInfo() {
//     const userInfoString = localStorage.getItem(this.USER_INFO_KEY);
//     try {
//       return userInfoString ? JSON.parse(userInfoString) : null;
//     } catch (error) {
//       console.error('Error parsing user info:', error);
//       return null;
//     }
//   }

//   // Clear all auth data
//   clearAuth() {
//     localStorage.removeItem(this.TOKEN_KEY);
//     localStorage.removeItem(this.USER_INFO_KEY);
//   }

//   // Redirect to login
//   redirectToLogin() {
//     // console.log('Redirecting to login...');
//     window.location.href = 'login.html';
//   }

//   // Redirect to dashboard
//   redirectToDashboard() {
//     // console.log('Redirecting to dashboard...');
//     window.location.href = 'dashboard.html';
//   }

//   // Detect current page type
//   detectPageType() {
//     const pathname = window.location.pathname.toLowerCase();
//     const filename = pathname.split('/').pop();
//     const href = window.location.href.toLowerCase();
    
//     // Check for login pages
//     if (
//       filename === 'login.html' || 
//       pathname.includes('login') ||
//       href.includes('login.html') ||
//       pathname === '/' ||
//       pathname === '/index.html' ||
//       filename === 'index.html' ||
//       filename === ''
//     ) {
//       return 'login';
//     }
    
//     // Check for dashboard pages (both dashboard.html and orders.html are protected)
//     if (
//       filename === 'dashboard.html' || 
//       filename === 'orders.html' ||
//       pathname.includes('dashboard') ||
//       pathname.includes('orders') ||
//       href.includes('dashboard.html') ||
//       href.includes('orders.html')
//     ) {
//       return 'dashboard';
//     }
    
//     // Default to dashboard for unknown pages (assuming they need protection)
//     return 'dashboard';
//   }

//   // Protect dashboard/admin pages - redirect to login if no token
//   protectDashboardPage() {
//     if (!this.hasToken()) {
//       // console.log('No token found, redirecting to login');
//       // Hide page content immediately
//       document.body.style.visibility = 'hidden';
//       this.redirectToLogin();
//       return false;
//     }
    
//     // Show the page
//     // console.log('User authenticated, showing dashboard');
//     document.body.style.visibility = 'visible';
//     return true;
//   }

//   // Protect login page - redirect to dashboard if token exists
//   protectLoginPage() {
//     if (this.hasToken()) {
//       // console.log('User already logged in, redirecting to dashboard');
//       // Hide login page
//       document.body.style.visibility = 'hidden';
//       this.redirectToDashboard();
//       return false;
//     }
    
//     // Show the login page
//     // console.log('No token found, showing login page');
//     document.body.style.visibility = 'visible';
//     return true;
//   }

//   // Logout function
//   logout() {
//     if (confirm('Are you sure you want to logout?')) {
//       this.clearAuth();
//       this.redirectToLogin();
//     }
//   }

//   // Setup logout button
//   setupLogoutButton() {
//     // Look for existing logout button
//     const logoutBtn = document.getElementById('logoutBtn');
//     if (logoutBtn) {
//       logoutBtn.onclick = (e) => {
//         e.preventDefault();
//         this.logout();
//       };
//       return;
//     }

//     // Create logout button if it doesn't exist
//     const navMenu = document.querySelector('.nav-menu');
//     if (navMenu) {
//       const logoutLink = document.createElement('a');
//       logoutLink.href = '#';
//       logoutLink.className = 'nav-link';
//       logoutLink.id = 'logoutBtn';
//       logoutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
//       logoutLink.onclick = (e) => {
//         e.preventDefault();
//         this.logout();
//       };
//       navMenu.appendChild(logoutLink);
//     }
//   }

//   // Add auth headers to fetch requests
//   getAuthHeaders() {
//     return {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${this.getToken()}`
//     };
//   }

//   // Enhanced fetch with auth headers
//   async authenticatedFetch(url, options = {}) {
//     const authHeaders = this.getAuthHeaders();
    
//     const enhancedOptions = {
//       ...options,
//       headers: {
//         ...authHeaders,
//         ...options.headers
//       }
//     };

//     try {
//       const response = await fetch(url, enhancedOptions);
      
//       // If unauthorized, clear auth and redirect to login
//       if (response.status === 401) {
//         // console.log('Unauthorized request, clearing auth and redirecting to login');
//         this.clearAuth();
//         this.redirectToLogin();
//         throw new Error('Unauthorized');
//       }
      
//       return response;
//     } catch (error) {
//       console.error('Authenticated fetch error:', error);
//       throw error;
//     }
//   }

//   // Initialize route protection
//   initialize() {
//     if (this.isInitialized) {
//       // console.log('Route protection already initialized');
//       return;
//     }

//     // console.log('Initializing route protection...');
    
//     const pageType = this.detectPageType();
//     // console.log('Detected page type:', pageType);
//     // console.log('Has token:', this.hasToken());
    
//     // Hide body initially to prevent flash
//     document.body.style.visibility = 'hidden';
    
//     if (pageType === 'login') {
//       // On login page - redirect to dashboard if token exists
//       // console.log('Protecting login page...');
//       const canAccess = this.protectLoginPage();
      
//       if (canAccess && typeof initializePageContent === 'function') {
//         // console.log('Calling initializePageContent for login page...');
//         initializePageContent();
//       }
//     } else {
//       // On dashboard pages - redirect to login if no token
//       // console.log('Protecting dashboard page...');
//       const isAuthenticated = this.protectDashboardPage();
      
//       if (isAuthenticated) {
//         // console.log('User authenticated, setting up dashboard...');
//         // Setup logout functionality
//         this.setupLogoutButton();
        
//         // Initialize page content if function exists
//         if (typeof initializePageContent === 'function') {
//           // console.log('Calling initializePageContent for dashboard...');
//           initializePageContent();
//         }
//       }
//     }
    
//     this.isInitialized = true;
//   }
// }

// // Create global instance
// const routeProtection = new RouteProtection();

// // Initialize on DOM content loaded
// document.addEventListener('DOMContentLoaded', function() {
//   // console.log('DOM content loaded, initializing route protection...');
//   routeProtection.initialize();
// });

// // Also initialize immediately if DOM is already loaded
// if (document.readyState === 'loading') {
//   // console.log('Document still loading, waiting for DOMContentLoaded');
// } else {
//   // console.log('Document already loaded, initializing immediately');
//   routeProtection.initialize();
// }

// // Export for global use
// window.routeProtection = routeProtection;

class RouteProtection {
  constructor() {
    this.TOKEN_KEY = 'adminToken';
    this.USER_INFO_KEY = 'adminInfo';
    this.isInitialized = false;
  }

  hasToken() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!(token && token.trim() !== '');
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserInfo() {
    const userInfoString = localStorage.getItem(this.USER_INFO_KEY);
    try {
      return userInfoString ? JSON.parse(userInfoString) : null;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  }

  clearAuth() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
  }

  redirectToLogin() {
    window.location.href = 'login.html';
  }

  redirectToDashboard() {
    window.location.href = 'dashboard.html';
  }

  detectPageType() {
    const pathname = window.location.pathname.toLowerCase();
    const filename = pathname.split('/').pop();
    const href = window.location.href.toLowerCase();

    if (
      filename === 'login.html' ||
      pathname.includes('login') ||
      href.includes('login.html') ||
      pathname === '/' ||
      pathname === '/index.html' ||
      filename === 'index.html' ||
      filename === ''
    ) {
      return 'login';
    }

    if (
      filename === 'dashboard.html' ||
      filename === 'orders.html' ||
      pathname.includes('dashboard') ||
      pathname.includes('orders') ||
      href.includes('dashboard.html') ||
      href.includes('orders.html')
    ) {
      return 'dashboard';
    }

    return 'dashboard';
  }

  protectDashboardPage() {
    if (!this.hasToken()) {
      document.body.style.visibility = 'hidden';
      this.redirectToLogin();
      return false;
    }
    document.body.style.visibility = 'visible';
    return true;
  }

  protectLoginPage() {
    if (this.hasToken()) {
      document.body.style.visibility = 'hidden';
      this.redirectToDashboard();
      return false;
    }
    document.body.style.visibility = 'visible';
    return true;
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.clearAuth();
      this.redirectToLogin();
    }
  }

  setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        this.logout();
      };
      return;
    }

    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
      const logoutLink = document.createElement('a');
      logoutLink.href = '#';
      logoutLink.className = 'nav-link';
      logoutLink.id = 'logoutBtn';
      logoutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      logoutLink.onclick = (e) => {
        e.preventDefault();
        this.logout();
      };
      navMenu.appendChild(logoutLink);
    }
  }

  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    };
  }

  async authenticatedFetch(url, options = {}) {
    const authHeaders = this.getAuthHeaders();
    const enhancedOptions = {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, enhancedOptions);
      if (response.status === 401) {
        this.clearAuth();
        this.redirectToLogin();
        throw new Error('Unauthorized');
      }
      return response;
    } catch (error) {
      console.error('Authenticated fetch error:', error);
      throw error;
    }
  }

  initialize() {
    if (this.isInitialized) return;

    const pageType = this.detectPageType();
    document.body.style.visibility = 'hidden';

    if (pageType === 'login') {
      const canAccess = this.protectLoginPage();
      if (canAccess && typeof initializePageContent === 'function') {
        initializePageContent();
      }
    } else {
      const isAuthenticated = this.protectDashboardPage();
      if (isAuthenticated) {
        this.setupLogoutButton();
        if (typeof initializePageContent === 'function') {
          initializePageContent();
        }
      }
    }
    this.isInitialized = true;
  }
}

// export the instance instead of putting it on window
export const routeProtection = new RouteProtection();

// auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  routeProtection.initialize();
});
if (document.readyState !== 'loading') {
  routeProtection.initialize();
}
