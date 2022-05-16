import http from "../axios/auth-http-common";

class AuthService {

    // ok
    register(data, myRole) {
        return http.post(`/register/${myRole}`, data);
    }

    // ok
    login(data) {
        return http.post(`/login`, data);
    }

    // ok
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user-name");
        localStorage.removeItem("user-role");
        localStorage.removeItem("my-cart");
        localStorage.removeItem("cart-total");
        console.log('logging out!');
    }

    // ok
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user-name'));
    }

    // ok
    getCurrentUserRole() {
        return JSON.parse(localStorage.getItem('user-role'));
    }

    // ok
    getRoles() {
        return http.get("/getRoles");
    }
}
export default new AuthService();