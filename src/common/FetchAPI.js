
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../navigation/RootNavigation';
import SimpleToast from 'react-native-simple-toast';
import timeout from './timeout';

export default async function FetchAPI (url, method, request){


  console.log(method + " " + url);
  if (method == 'GET') {
    return await new Promise((resp, rej) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          timeout(30000,
            fetch(url, {
              method: method,
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },

            })
              .then(res => {
                if (res.status == 200 || res.status == 400) {
                  console.log("Success");
                  res.json().then(data => {
                    if (data.Status == 500 && data.ErrorData[0].Value == 'LOGOUT') {
                      RootNavigation.navigate('Login');
                      resp(data);
                    } else {
                      resp(data);
                    }

                  })
                } else if (res.status == 401) {
                  console.log("un authorize");
                  resp(res);
                }
                else {
                  SimpleToast.show(
                    "Oops! Something went wrong. Please contact your administrator",
                    SimpleToast.LONG,
                  );
                  resp(res);
                  RootNavigation.navigate('Login', { back: 'off' });
                }
              })
              .catch(err => {
                // resp(err);
                RootNavigation.navigate('Login', { back: 'off' });
                rej(err);
              })
          ).catch(e => {
            console.log(e);
            resp(e);
            SimpleToast.show(
              "Please try again after sometime",
              SimpleToast.LONG,
            );
          });
        } else {
          resp("");
          SimpleToast.show(
            "Please check your internet connection",
            SimpleToast.LONG,
          );
        }
      });
    });
  } else {
    return new Promise((resp, rej) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          timeout(30000,
            fetch(url, {
              method: method,
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(request),
            })
              .then(res => {
                if (res.status == 200) {
                  res.json().then(data => {
                   
                      resp(data);
                    
                  })
                } else if (res.status == 401) {
                 
                  resp(res);
                  

                }  else if (res.status == 400) {
                 
                  resp("400");
                  

                } else {
                  resp(res);
                  SimpleToast.show(
                    "Oops! Something went wrong. Please contact your administrator",
                    SimpleToast.LONG,
                  );
                  RootNavigation.navigate('Login', { back: 'off' });
                }
              })
              .catch(err => {
                console.log("tt", err);
                resp(err);

              })
          ).catch(e => {
            console.log(e);
            resp(e);
            SimpleToast.show(
              "Please try again after sometime",
              SimpleToast.LONG,
            );
          });
        } else {
          resp("");
          SimpleToast.show(
            "Please check your internet connection",
            SimpleToast.LONG,
            SimpleToast.BOTTOM
          );
        }
      });
    });
  }

};


