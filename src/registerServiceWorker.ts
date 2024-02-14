import * as api from "@/api";
import { UserUpdateDTO } from "@/classes/user-dto";

const registerSW = async () => {
  console.log('ok')
  if ('serviceWorker' in navigator) {
    //window.addEventListener('load', function() {
      navigator.serviceWorker.register('./service-worker.js')
        .then(function(registration) {registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array('BOhrUPLUdWMW8RNESkjmZxUgT8AfPtcHHq0hMyI0K_fBKYdjthSwJ1Ohj1Ff_TZgpROZO7GIwiR1eDXg6ZTi1ZE')
        })
        .then(async (subscription) => {
          const subs = subscription.toJSON();
          const update: Partial<UserUpdateDTO> = {
              endpoint: subs.endpoint as string,
              expirationTime: subs.expirationTime as number,
              key_p256dh: subs.keys ? subs.keys.p256dh : undefined as unknown as string,
              key_auth: subs.keys ? subs.keys.auth : undefined as unknown as string  
          }
          console.log(update)
          //await api.administration.saveSW(update)
          await api.user.update(update)
          //await api.administration.saveSW(subs.endpoint, subs.expirationTime, subs.keys)//endpoint, auth, p256dh)
        })
        .catch((error) => {
          console.error('Error subscribing to push: ', error);
        });
      })
      .catch((error) => {
        console.error('Error registering service worker: ', error);
      });
    //})
  }
}

export default registerSW

const urlB64ToUint8Array = (base64String: string | any[]) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')//\-
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray; 
};

 
