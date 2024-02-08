import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        _id: '',
        name: '',
        surname: '',
        username: '',
        cf: '',
        email: '',
        email_alexa: '',
        phone: '',
        user_type: '',
        new_user: '',
        token: '',
        endpoint: '',
        expirationTime: '',
        key_p256dh: '',
        key_auth: ''
    }),
    actions: {
        initializeStore() {
            const stored = JSON.parse(localStorage.getItem("userStore") as string);
            if (stored) {
                if ("User" in stored && "name" in stored.User) {
                    this._id = stored.User._id;
                    this.name = stored.User.name;
                    this.surname = stored.User.surname;
                    this.username = stored.User.username;
                    this.cf = stored.User.cf;
                    this.email = stored.User.email;
                    this.email_alexa = stored.User.email_alexa;
                    this.phone = stored.User.phone;
                    this.user_type = stored.User.user_type;
                    this.new_user = stored.User.new_user;
                    this.token = stored.User.token;
                    this.endpoint = stored.endpoint;
                    this.expirationTime = stored.expirationTime;
                    this.key_p256dh = stored.key_p256dh;
                    this.key_auth = stored.key_auth;
                }
            }
        },
        logout() {
            this.$reset();
        },
        set_user(user: any) {
            this._id = user._id;
            this.name = user.name;
            this.surname = user.surname;
            this.username = user.username;
            this.cf = user.cf;
            this.email = user.email;
            this.email_alexa = user.email_alexa;
            this.phone = user.phone;
            this.user_type = user.user_type;
            this.new_user = user.new_user;
            this.token = user.access_token;
            this.endpoint = user.endpoint;
            this.expirationTime = user.expirationTime;
            this.key_p256dh = user.key_p256dh;
            this.key_auth = user.key_auth;
        }
    }
})