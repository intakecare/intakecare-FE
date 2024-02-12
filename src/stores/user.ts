import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        _id: '',
        name: '',
        surname: '',
        username: '',
        sex: '',
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
    persist: true,
    actions: {
        initializeStore() {
            const stored = JSON.parse(localStorage.getItem("userStore") as string);
            if (stored) {
                if ("User" in stored && "name" in stored.User) {
                    this._id = stored._id;
                    this.name = stored.name;
                    this.surname = stored.surname;
                    this.username = stored.username;
                    this.sex = stored.sex
                    this.cf = stored.cf;
                    this.email = stored.email;
                    this.email_alexa = stored.email_alexa;
                    this.phone = stored.phone;
                    this.user_type = stored.user_type;
                    this.new_user = stored.new_user;
                    this.token = stored.token;
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
            this.sex = user.sex;
            this.email = user.email;
            this.email_alexa = user.email_alexa;
            this.phone = user.phone;
            this.user_type = user.user_type;
            this.new_user = user.new_user;
            this.token = user.token;
            this.endpoint = user.endpoint;
            this.expirationTime = user.expirationTime;
            this.key_p256dh = user.key_p256dh;
            this.key_auth = user.key_auth;
        },
        patch(user: any) {
            this.$patch(user);
        }
    }
})